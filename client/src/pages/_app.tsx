import { AppProps } from 'next/app';
import * as React from 'react';
import { NextPageContext } from 'next';

import { AuthProvider } from '../services/Auth.context';
import { GlobalMessagingProvider } from '../services/GlobalMessaging.context';
import { StateProvider } from '../services/State.context';
import { getTheme } from '../components/helpers';

import './global.scss';
import css from './theme.module.scss';

function MyApp({ Component, pageProps: { props } }: AppProps) {
  const theme = getTheme(props.host) === 1 ? 'afghan' : 'ukrain'

  return (
    <div className={`${css['theme']} ${css[theme]}`}>
    <AuthProvider>
      <GlobalMessagingProvider>
        <StateProvider>
            <Component props={props} />
        </StateProvider>
      </GlobalMessagingProvider>
    </AuthProvider>
    </div>
  );
}
MyApp.getServerSideProps = async (ctx: NextPageContext) => {
  let host: string
  if (ctx.req) {
    host = ctx.req.headers.host
  }

  return { props: { host } }
}
export default MyApp;
