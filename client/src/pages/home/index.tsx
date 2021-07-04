import { Field, Form, Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';

import PageContent from '../../components/PageContent';

import { useAuth } from '../../services/Auth.context';
import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';
import TokenService from '../../services/Token.service';

import { ILoginIn } from '../../types/auth.types';
import internal from 'stream';
import styled from '@emotion/styled';
interface IProps {
  action: string;
}
export interface QA {
  question: {
    color: "rgb(0, 128, 129)"
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
  };
  answers: {
    color: string
    extras: {
      answeridentifier: string
      answertranslation: string
      customType: string
      dropdown: boolean
      freeanswer: boolean
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
  }[];
}
const ModalBackdrop = styled.div`
  opacity: ${props => !props.open ? 0 : 1};
  pointer-events: ${props => !props.open ? `none` : `all`};
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
  const [QAs, currentQA] = useState<QA>(undefined);

  useEffect(() => {
    if (props.action && props.action == 'logout') {
      authDispatch({
        type: 'removeAuthDetails'
      });

      tokenService.deleteToken();

      Router.push('/');
    }
  }, []);

  const getAnswers = (question, model) => Object.values(model.layers.find(layer => layer.type === "diagram-nodes").models)
    .filter(links => Object.values(model.layers.find(layer => layer.type === "diagram-links").models)
      .filter(layer => layer.source === question.id).map(l => l.target).includes(links.id))

  useEffect(() => {
    FetchService.isofetchAuthed('/flows/get', undefined, 'GET')
      .then((res) => {
        const diagramNodes = res.payload.model.layers.find(layer => layer.type === "diagram-nodes").models
        const startquestion = Object.values(diagramNodes).find(model => model.ports.find(port => port.label === "In").links.length === 0)
        const answers = getAnswers(startquestion, res.payload.model)
        setmodel(res.payload.model)
        currentQA({ question: startquestion, answers })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
      })
  }, [])

  const setNextQA = (answer) => {
    const form_payload = { [QAs.question.name]: answer.name }
    localStorage.setItem('answers', JSON.stringify({ ...JSON.parse(localStorage.getItem('answers')), ...form_payload }))
    var nextQuestions = Object.values(model.layers[1].models).find(n => {
      return n.ports[0].links.includes(answer.ports[1].links[0])
    });
    if (!nextQuestions) {
      FetchService.isofetch(
        '/answers/save',
        {
          answers: localStorage.getItem('answers')
        },
        'POST'
      ).then((res: any) => {
        setmodalopen(true)
      })
    } else {
      const answers = getAnswers(nextQuestions, model)
      currentQA({ question: nextQuestions, answers: answers })
    }
  }

  return (
    <PageContent>
      <div>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          onSubmit={(values: ILoginIn, { setSubmitting }: FormikActions<ILoginIn>) => {
            FetchService.isofetch(
              '/auth/login',
              {
                email: values.email,
                password: values.password
              },
              'POST'
            )
              .then((res: any) => {
                setSubmitting(false);
                if (res.success) {
                  // save token in cookie for subsequent requests
                  const tokenService = new TokenService();
                  tokenService.saveToken(res.authToken);

                  authDispatch({
                    type: 'setAuthDetails',
                    payload: {
                      email: res.email
                    }
                  });

                  Router.push('/dashboard');
                } else {
                  messageDispatch({
                    type: 'setMessage',
                    payload: {
                      message: res.message
                    }
                  });
                }
              })
              .catch();
          }}
          render={() => (
            <Form>
              <div className="inputWrap">
                <label htmlFor="email">Email</label>
                <Field id="email" name="email" placeholder="" type="email" />
              </div>

              <div className="inputWrap">
                <label htmlFor="password">Password</label>
                <Field id="password" name="password" placeholder="" type="password" />
              </div>

              <button type="submit" style={{ display: 'block' }}>
                Submit
              </button>
            </Form>
          )}
        />

        <div>
          Click{' '}
          <Link href="/about">
            <a>here</a>
          </Link>{' '}
          to read more
        </div>
        <div>
          Click{' '}
          <Link href="/register">
            <a>here</a>
          </Link>{' '}
          to register
        </div>
      </div>
      <div>
        {QAs ? (
          <div>
            <h1>{QAs.question.name}</h1>
            <div className="">
              {QAs.answers.map((a, i) => (
                <button className={`btn btn-primary`} key={i} onClick={e => {
                  setNextQA(a)
                }}>{a.name}</button>
              ))}
            </div>
          </div>
        ) : "Nothing"}
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
