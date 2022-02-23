import { AppProps } from 'next/app';
import * as React from 'react';

import { AuthProvider } from '../services/Auth.context';
import { GlobalMessagingProvider } from '../services/GlobalMessaging.context';
import { StateProvider } from '../services/State.context';

import './global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GlobalMessagingProvider>
        <StateProvider>
          <Component {...pageProps} />
        </StateProvider>
      </GlobalMessagingProvider>
    </AuthProvider>
  );
}

export default MyApp;
