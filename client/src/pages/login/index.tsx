import css from './index.module.scss';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useAuth } from '../../services/Auth.context';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect } from 'react';

import TokenService from '../../services/Token.service';
import PageContent from '../../components/PageContent';

import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';
import { ILoginIn } from '../../types/global.types';

interface IProps { }

function Login(props: IProps) {
  const [auth, authDispatch] = useAuth()
  const [messageState, messageDispatch] = useGlobalMessaging();

  useEffect(() => {
    if (auth.email) {
      Router.push('/');
    }
  }, []);

  return (
    <PageContent props={props}>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={(values: ILoginIn, { setSubmitting }: FormikHelpers<ILoginIn>) => {
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
            <div className='form-group'>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" className="form-control" placeholder="" type="email" />
            </div>

            <div className='form-group mb-3'>
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" className="form-control" placeholder="" type="password" />
            </div>

            <button className="btn btn-primary" type="submit" style={{ display: 'block' }}>
              Submit
            </button>
          </Form>
        )}
      />
    </PageContent>
  );
}
Login.getInitialProps = async (ctx: NextPageContext) => {
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

export default Login;
