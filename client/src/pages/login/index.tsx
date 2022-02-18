import css from './index.module.scss';
import Router from 'next/router';
import { useAuth } from '../../services/Auth.context';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect } from 'react';

import TokenService from '../../services/Token.service';
import PageContent from '../../components/PageContent';

import FetchService from '../../services/Fetch.service';
import { useGlobalMessaging } from '../../services/GlobalMessaging.context';
import { ILoginIn } from '../../types/auth.types';

import { IRegisterIn } from '../../types/auth.types';

interface IProps { }

function Register(props: IProps) {
  const [auth, authDispatch] = useAuth()
  const [messageState, messageDispatch] = useGlobalMessaging();

  useEffect(() => {
    if (auth.email) {
      Router.push('/');
    }
  }, []);

  return (
    <PageContent>
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
    </PageContent>
  );
}

export default Register;
