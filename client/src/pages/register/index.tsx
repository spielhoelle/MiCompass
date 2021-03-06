// import css from './index.module.scss';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useAuth } from '../../services/Auth.context';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect } from 'react';

import PageContent from '../../components/PageContent';

import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';

import { IRegisterIn } from '../../types/global';

interface IProps {}

function Register(props: IProps) {
  const [messageState, messageDispatch] = useGlobalMessaging();

  const [auth, authDispatch] = useAuth()
  useEffect(() => {
    if (auth.email) {
      Router.push('/');
    }
  }, []);
  return (
    <PageContent props={props}>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        }}
        onSubmit={(values: IRegisterIn, { setSubmitting }: FormikHelpers<IRegisterIn>) => {
          FetchService.isofetch(
            '/auth/register',
            {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password
            },
            'POST'
          )
            .then((res) => {
              setSubmitting(false);
              if (res.success) {
                messageDispatch({
                  type: 'setMessage',
                  payload: {
                    message: 'You have registered!'
                  }
                });
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
            <label htmlFor="firstName">First Name</label>
            <Field id="firstName" name="firstName" placeholder="" type="text" />

            <label htmlFor="lastName">Last Name</label>
            <Field id="lastName" name="lastName" placeholder="" type="text" />

            <label htmlFor="email">Email</label>
            <Field id="email" name="email" placeholder="" type="email" />

            <label htmlFor="password">Password</label>
            <Field id="password" name="password" placeholder="" type="password" />

            <button type="submit" style={{ display: 'block' }}>
              Submit
            </button>
          </Form>
        )}
      />
    </PageContent>
  );
}
Register.getInitialProps = async (ctx: NextPageContext) => {
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

export default Register;
