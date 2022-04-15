import css from './index.module.scss';
import Router from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { NextPageContext } from 'next';

import PageContent from '../../components/PageContent';
import { calcResults, getTheme } from '../../components/helpers'

import { useAuth } from '../../services/Auth.context';
import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';
import TokenService from '../../services/Token.service';

import styled from '@emotion/styled';
import { useGlobalState } from '../../services/State.context';
import { Answer, ModelA, ModelQ, QA, History } from '../../types/global';

const ModalBackdrop = styled.div<{ open: boolean }>`
  opacity: ${(props) => !props.open ? 0 : 1};
  pointer-events: ${(props) => !props.open ? `none` : `all`};
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.4);
`
const Button = styled.button`
  white-space: pre-wrap;
  word-wrap: break-word;
`
let currentFlow = 'afghan-refugee-chatbot';

function Home({ props }) {
  const tokenService = new TokenService();
  const [messageState, messageDispatch] = useGlobalMessaging();
  const [authState, authDispatch] = useAuth();
  const [model, setmodel] = useState(undefined);
  const [modalopen, setmodalopen] = useState(false);
  const [modaldata, setmodaldata] = useState(undefined);
  const [QAs, setQAs] = useState<QA | undefined>(undefined);
  const [history, setHistory] = useState<History[] | undefined>([]);
  const messagesEndRef = useRef(null)
  const [state, stateDispatch] = useGlobalState();
  const [currentClass, setCurrentClass] = useState<string | undefined>(undefined);
  const [gameover, setgameover] = useState<boolean>(false);

  useEffect(() => {
    setCurrentClass(`${css.animation}`)
    setTimeout(() => {
      setCurrentClass(`${css.animation} ${css.nottransparent}`)
    }, 20);
    scrollToBottom()
  }, [history]);

  useEffect(() => {
    if (props.action && props.action == 'logout') {
      authDispatch({
        type: 'removeAuthDetails'
      });
      tokenService.deleteToken();
      Router.push('/');
    }
  }, []);

  const resetQuestions = () => {
    messageDispatch({
      type: 'setMessage',
      payload: {
        message: ''
      }
    });
    const diagramNodes = model.layers.find(layer => layer.type === "diagram-nodes").models
    const startquestion = Object.values(diagramNodes).find((model: any) => model.ports.find(port => port.label === "In").links.length === 0)
    const answers = getAnswers(startquestion, model)
    const sortedanswers = answers.sort((a: ModelA, b: ModelA) => a.y - b.y)
    setHistory([])
    setmodalopen(false)
    setQAs({ question: startquestion as ModelQ, answers: sortedanswers as ModelA[] })
  }
  useEffect(() => {
    FetchService.isofetchAuthed('/flows/get', undefined, 'GET')
      .then((res) => {
        if (getTheme(props.host) === 2) {
          currentFlow = 'ukrain-help-bot'
        }
        const usedFLow = res.payload.model.find(f => f.flowname === currentFlow)
        const diagramNodes = usedFLow.data.layers.find(layer => layer.type === "diagram-nodes").models
        const startquestion = Object.values(diagramNodes).find((model: any) => model.ports.find(port => port.label === "In").links.length === 0)
        const answers = getAnswers(startquestion, usedFLow.data)
        setmodel(usedFLow.data)
        const sortedanswers = answers.sort((a: ModelA, b: ModelA) => a.y - b.y)
        setQAs({ question: startquestion as ModelQ, answers: sortedanswers as ModelA[] })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
      })
  }, [])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  const getAnswers = (question, model) => Object.values(model.layers.find(layer => layer.type === "diagram-nodes").models)
    .filter((links: any) => Object.values(model.layers.find(layer => layer.type === "diagram-links").models)
      .filter((layer: any) => layer.source === question.id).map((l: any) => l.target).includes(links.id))


  const setNextQA = (answer, value, points, index) => {
    setHistory([...history, { question: QAs.question, answers: QAs.answers, choosenAnswer: answer, choosenAnswerValue: value }])

    const form_payload: Answer = { question: QAs.question.name, answer: value, points: answer.extras.pointanswer ? points : -1, index: index };
    var _paq = (window as any)._paq = (window as any)._paq || [];
    _paq.push(['trackEvent', 'Contact', 'Email Link Click', 'name@example.com']);
    const nextQuestions = getNextQuestion()
    if (!nextQuestions) {
      setQAs(undefined)
      const finalFormPayload = [...JSON.parse(localStorage.getItem('answers')), form_payload]
      setmodaldata(calcResults(finalFormPayload))
      FetchService.isofetch(
        '/answers/save',
        { flow: currentFlow, data: finalFormPayload },
        'POST'
      ).then((res: any) => {
        localStorage.removeItem('answers')
        messageDispatch({
          type: 'setMessage',
          payload: {
            message: 'Thank you!'
          }
        });
        setTimeout(() => {
          setmodalopen(true)
        }, 200);
      })
    } else {
      const answers = getAnswers(nextQuestions, model)
      setQAs({ question: nextQuestions as ModelQ, answers: answers as ModelA[] })

      const question = Object.values(model.layers[1].models).filter((item: ModelQ) => item.extras.customType === "question")
      if (history.length < question.length - 1) {
      }
      let savedAnswers = JSON.parse(localStorage.getItem('answers')) || []
      const currentAnswerIndex = savedAnswers.findIndex(a => a.index === form_payload.index)
      if (currentAnswerIndex !== -1) {
        savedAnswers[currentAnswerIndex] = form_payload
      } else {
        savedAnswers.push(form_payload)
      }
      localStorage.setItem('answers', JSON.stringify(savedAnswers))
    }
  }
  const myRef = useRef([]);
  const getNextQuestion = () => {
    if (model && QAs) {
      var nextQuestions = Object.values(model.layers[1].models).find((n: any) => {
        return n.ports[0].links.includes(QAs.answers[0].ports[1].links[0])
      });
      return nextQuestions
    } else {
      false
    }
  }


  return (
    <PageContent props={props}>
      <div className={css.bottomspacing}>
        {history.length > 0 && history.map((historyItem, index) => (
          <div className='row' key={index} >
            <div className='col-md-6'>
              {historyItem.question.extras.image && (
                <div className='row'>
                  <div className='col-md-6'>
                    <img className="rounded-3 mb-3 w-100" src={historyItem.question.extras.image} alt={historyItem.question.name} />
                  </div>
                </div>
              )}
              <Button className={`btn btn-light mb-3 text-start d-block`} disabled>{state.lang == 'af' ? historyItem.question.extras.questiontranslation : historyItem.question.name}</Button>
              {historyItem.choosenAnswer.extras.freeanswer && (
                <>
                  <label htmlFor={historyItem.choosenAnswer.extras.answeridentifier} className="form-label">{state.lang == 'af' ? historyItem.choosenAnswer.extras.answertranslation : historyItem.choosenAnswer.name}</label>
                  <input value={historyItem.choosenAnswerValue} disabled className={`form-control mb-3`} />
                </>
              )}
              <div className="">
                {historyItem.answers.map((a: ModelA, i) => (
                  <div key={i}>
                    <Button className={`btn mb-2 btn-sm text-start ${getTheme(props.host) === 1 ? `btn-danger` : `btn-warning`} ${historyItem.choosenAnswer.name === a.name ? `opacity-50` : ` opacity-25`}`} disabled>{historyItem.choosenAnswer.extras.freeanswer ? historyItem.choosenAnswerValue : state.lang == 'af' ? a.extras.answertranslation : a.name}</Button>
                  </div>
                ))}
              </div>
            </div>
            {!historyItem.choosenAnswer.extras.freeanswer && (
              <div className='offset-md-6 col-md-6 text-end'>
                <Button className={`btn mb-2 btn-sm ${getTheme(props.host) === 1 ? `btn-danger` : `btn-warning`} text-start ${css.nottransparent}`} disabled>{state.lang == 'af' ? historyItem.choosenAnswer.extras.answertranslation : historyItem.choosenAnswer.name}</Button>
              </div>
            )}
          </div>
        ))}
        {QAs && QAs.question ? (
          <div className={`row`}>
            <div className='col-md-6'>
              <div className={`${css.animatedformfield} ${currentClass} `}>
                {QAs.question.extras.image && (
                  <div className='row'>
                    <div className='col-6'>
                      <img className="rounded-3 mb-3 w-100" src={QAs.question.extras.image} alt={QAs.question.name} />
                    </div>
                  </div>
                )}
                <Button className={`btn btn-light mb-3 text-start`} disabled>{state.lang == 'af' ? QAs.question.extras.questiontranslation : QAs.question.name}</Button>
                <div className="">
                  {QAs.answers.map((a, i) => (
                    <div key={i}>
                      {a.extras.freeanswer ? (
                        <>
                          <form onSubmit={e => {
                            e.preventDefault()
                            setCurrentClass(css.dNone)
                            setNextQA(a, myRef.current[i].value, a.extras.points, history.length)

                          }}>
                            <label htmlFor={a.extras.answeridentifier} className="form-label">{state.lang == 'af' ? a.extras.answertranslation : a.name}</label>
                            <input required={true} type={a.extras.freeanswer_type ? a.extras.freeanswer_type : "text"} ref={ref => myRef.current[i] = ref} id={a.extras.answeridentifier} name={a.extras.answeridentifier} className={`form-control mb-3`} />
                            <Button type="submit" className={`btn ${getTheme(props.host) === 1 ? `btn-danger` : `btn-warning`} mb-2 btn-sm text-start`} key={i} onClick={e => {
                            }}>{state.lang == 'af' ? "ښه، دوام ورکړئ" : "Ok, continue..."}</Button>
                          </form>
                        </>
                      ) : (
                          <Button className={`btn ${getTheme(props.host) === 1 ? `btn-danger` : `btn-warning`} mb-2 btn-sm text-start`} key={i} onClick={e => {
                          setCurrentClass(css.dNone)
                          setNextQA(a, a.extras.answeridentifier, a.extras.points, history.length)
                          }}>{state.lang == 'af' ? a.extras.answertranslation : a.name}</Button>
                      )}
                    </div>)
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : !model ? "loading..." : null}
        {gameover && (
          <>
            <div className={`row`}>
              <div className='col-md-6'>
                <Button type="button" className="btn btn-success" onClick={e => {
                  resetQuestions()
                  setgameover(false)
                }}>Play again!</Button>
              </div>
            </div>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      {modalopen && (
        <ModalBackdrop open={modalopen}>
          <div className={`modal ${modalopen ? `d-block` : ``}`} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modaldata.title}</h5>
                  <Button type="button" className="btn-close" aria-label="Close" onClick={e => {
                    setmodalopen(false)
                  }}></Button>
                </div>
                <div className="modal-body">
                  <p>{modaldata.text}</p>
                </div>
                <div className="modal-footer">
                  <Button type="button" className="btn btn-warning" onClick={e => {
                    setgameover(true)
                    setmodalopen(false)
                  }}>Close</Button>
                  <Button type="button" className={`btn ${getTheme(props.host) === 1 ? `btn-danger` : `btn-warning`}`} onClick={e => {
                    resetQuestions()
                  }}>Play again</Button>
                </div>
              </div>
            </div>
          </div>
        </ModalBackdrop>
      )}
    </PageContent>
  );
}
Home.getInitialProps = async (ctx: NextPageContext) => {
  if (ctx.query && ctx.query.l == 't') {
    return { action: 'logout' };
  }
  const { req } = ctx;
  let host
  if (req) {
    host = req.headers.host // will give you localhost:3000
  } else {
    // Get host from window on client
    host = window.location.host;
  }
  // Pass data to the page via props
  return { props: { host } }
};

export default Home;
