import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { NextPageContext } from 'next';

import PageContent from '../../components/PageContent';

import { useAuth } from '../../services/Auth.context';
import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';
import TokenService from '../../services/Token.service';

import internal from 'stream';
import styled from '@emotion/styled';
import { useGlobalState } from '../../services/State.context';
interface IProps {
  action: string;
}
export interface ModelQ {
  color: string
  extras: {
    customType: string
    questionidentifier: string
    questiontranslation: string
  }
  id: string
  name: string
  ports: any[]
  portsInOrder: any[]
  portsOutOrder: any[]
  selected: boolean
  type: string
  x: number
  y: number
}
export interface ModelA {
  color: string
  extras: {
    customType: string
    answertranslation: string
    answeridentifier: string
    freeanswer: boolean
    freeanswer_type: string
    dropdown: boolean
  }
  id: string
  name: string
  ports: any[]
  portsInOrder: any[]
  portsOutOrder: any[]
  selected: boolean
  type: string
  x: number
  y: number
}
export interface QA {
  question: ModelQ;
  answers: ModelA[];
}
export interface History extends QA {
  choosenAnswer: ModelA;
  choosenAnswerValue: string;
}
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
const Modal = styled.div`
  position: fixed;
  width: 300px;
  height: 400px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`
function Home(props: IProps) {
  const tokenService = new TokenService();
  const [messageState, messageDispatch] = useGlobalMessaging();
  const [authState, authDispatch] = useAuth();
  const [model, setmodel] = useState(undefined);
  const [modalopen, setmodalopen] = useState(false);
  const [QAs, currentQA] = useState<QA | undefined>(undefined);
  const [history, setHistory] = useState<History[] | undefined>([]);
  const messagesEndRef = useRef(null)
  const [state, stateDispatch] = useGlobalState();
  useEffect(() => {
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

  useEffect(() => {
    FetchService.isofetchAuthed('/flows/get', undefined, 'GET')
      .then((res) => {
        const diagramNodes = res.payload.model[0].data.layers.find(layer => layer.type === "diagram-nodes").models
        const startquestion = Object.values(diagramNodes).find((model: any) => model.ports.find(port => port.label === "In").links.length === 0)
        const answers = getAnswers(startquestion, res.payload.model[0].data)
        setmodel(res.payload.model[0].data)
        const sortedanswers = answers.sort((a: ModelA, b: ModelA) => a.y - b.y)
        currentQA({ question: startquestion as ModelQ, answers: sortedanswers as ModelA[] })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
      })
  }, [])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  const getAnswers = (question, model) => Object.values(model.layers.find(layer => layer.type === "diagram-nodes").models)
    .filter((links: any) => Object.values(model.layers.find(layer => layer.type === "diagram-links").models)
      .filter((layer: any) => layer.source === question.id).map((l: any) => l.target).includes(links.id))

  const setNextQA = (answer, value) => {
    const form_payload = { [QAs.question.name]: value }
    var nextQuestions = Object.values(model.layers[1].models).find((n: any) => {
      return n.ports[0].links.includes(answer.ports[1].links[0])
    });
    if (!nextQuestions) {
      FetchService.isofetch(
        '/answers/save',
        { answers: localStorage.getItem('answers') },
        'POST'
      ).then((res: any) => {
          // setmodalopen(true)
        messageDispatch({
          type: 'setMessage',
          payload: {
            message: 'Thank you!'
          }
        });
        localStorage.removeItem('answers')
      })
    } else {
      if (history.length < Object.values(model.layers[1].models).filter((item: ModelQ) => item.extras.customType === "question").length - 1) {
        setHistory([...history, { question: QAs.question, answers: QAs.answers, choosenAnswer: answer, choosenAnswerValue: value }])
      }
      localStorage.setItem('answers', JSON.stringify({ ...JSON.parse(localStorage.getItem('answers')), ...form_payload }))
      const answers = getAnswers(nextQuestions, model)
      currentQA({ question: nextQuestions as ModelQ, answers: answers as ModelA[] })
    }
  }
  const myRef = useRef([]);
  return (
    <PageContent>
      <div>
        {history.length > 0 && history.map((historyItem, index) => (
          <div className='row' key={index} >
            <div className='col-md-6'>
              <button className={`btn btn-light mb-3 text-start`} disabled>{state.lang == 'af' ? historyItem.question.extras.questiontranslation : historyItem.question.name}</button >
              {historyItem.choosenAnswer.extras.freeanswer && (
                <>
                  <label htmlFor={historyItem.choosenAnswer.extras.answeridentifier} className="form-label">{state.lang == 'af' ? historyItem.choosenAnswer.extras.answertranslation : historyItem.choosenAnswer.name}</label>
                  <input value={historyItem.choosenAnswerValue} disabled className={`form-control mb-3`} />
                </>
              )}
              <div className="">
                {historyItem.answers.map((a: ModelA, i) => (
                  <div key={i}>
                    <button className={`btn mb-2 btn-sm text-start ${historyItem.choosenAnswer.name === a.name ? `btn-primary opacity-50` : `btn-secondary opacity-50`}`} disabled>{historyItem.choosenAnswer.extras.freeanswer ? historyItem.choosenAnswerValue : state.lang == 'af' ? a.extras.answertranslation : a.name}</button>
                  </div>
                ))}
              </div>
            </div>
            {!historyItem.choosenAnswer.extras.freeanswer && (
              <div className='offset-md-6 col-md-6 text-end'>
                <button className={`btn mb-2 btn-sm btn-primary text-start`} disabled>{state.lang == 'af' ? historyItem.choosenAnswer.extras.answertranslation : historyItem.choosenAnswer.name}</button>
              </div>
            )}
          </div>
        ))}
        {QAs ? (
          <div className='row'>
            <div className='col-md-6'>
              <button className={`btn btn-light mb-3 text-start`} disabled>{state.lang == 'af' ? QAs.question.extras.questiontranslation : QAs.question.name}</button >
              <div className="">
                {QAs.answers.map((a, i) => (
                  <div key={i}>
                    {a.extras.freeanswer ? (
                      <>
                        <label htmlFor={a.extras.answeridentifier} className="form-label">{state.lang == 'af' ? a.extras.answertranslation : a.name}</label>
                        <input ref={ref => myRef.current[i] = ref} id={a.extras.answeridentifier} name={a.extras.answeridentifier} className={`form-control mb-3`} />
                        <button className={`btn btn-primary mb-2 btn-sm text-start`} key={i} onClick={e => {
                          setNextQA(a, myRef.current[i].value)
                        }}>{state.lang == 'af' ? "سپارل" : "Submit"}</button>
                      </>
                    ) : (
                      <button className={`btn btn-primary mb-2 btn-sm text-start`} key={i} onClick={e => {
                        setNextQA(a, a.extras.answeridentifier)
                      }}>{state.lang == 'af' ? a.extras.answertranslation : a.name}</button>
                    )}
                  </div>)
                )}
              </div>
            </div>
          </div>
        ) : "loading..."}
        <div ref={messagesEndRef} />
      </div>
      <ModalBackdrop open={modalopen} onClick={e => {
        setmodalopen(false)
      }}>
        <Modal>
          Success! You gonna hear from us soon!
        </Modal>
      </ModalBackdrop>
    </PageContent>
  );
}

Home.getInitialProps = async (ctx: NextPageContext) => {
  if (ctx.query && ctx.query.l == 't') {
    return { action: 'logout' };
  }
  return {};
};

export default Home;
