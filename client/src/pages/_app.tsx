import { AppProps } from 'next/app';
import { useRouter } from 'next/router'
import * as React from 'react';
import { NextPageContext } from 'next';

import { AuthProvider } from '../services/Auth.context';
import { GlobalMessagingProvider } from '../services/GlobalMessaging.context';
import { StateProvider } from '../services/State.context';
import { getTheme, isAdmin } from '../components/helpers';

import './global.scss';
import css from './theme.module.scss';

function MyApp({ Component, pageProps: { props } }: any, AppProps) {
  const theme = props && getTheme(props.host) === 1 ? 'afghan' : 'ukrain'
  const router = useRouter()

  return (
    <div className={`${css['theme']} ${!isAdmin(router.pathname) ? `${css[theme]}` : ``} `}>
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
