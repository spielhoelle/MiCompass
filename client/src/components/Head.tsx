import css from './Head.module.scss';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';

import TokenService from '../services/Token.service';
import { useAuth } from '../services/Auth.context';
import { useGlobalMessaging } from '../services/GlobalMessaging.context';
import { useGlobalState } from '../services/State.context';
import Link from 'next/link';
import { getTheme } from './helpers';

interface IProps {
  props: any
  host?: string
}

function Header({ props }: IProps) {
  useEffect(() => {
    var _paq = (window as any)._paq = (window as any)._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function () {
      var u = "https://piwik.thomaskuhnert.com/";
      _paq.push(['setTrackerUrl', u + 'matomo.php']);
      _paq.push(['setSiteId', '18']);
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript'; g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
    })();
  }, [])
  const switchLanguage = (e, lang) => {
    e.preventDefault()
    const url = new URL((window as any).location);
    url.searchParams.set('lang', lang);
    (window as any).history.pushState({}, '', (url as unknown as string));
    stateDispatch({
      type: 'setLang',
      payload: {
        lang
      }
    });
  }

  const tokenService = new TokenService();
  const [globalMessaging, messageDispatch] = useGlobalMessaging();
  const [auth, authDispatch] = useAuth();
  const [navbar, toggleNav] = useState(false);
  const [state, stateDispatch] = useGlobalState();
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top">
      <Head>
        <title>MiCompass</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <noscript>
        <p>
          <img src="https://piwik.thomaskuhnert.com/matomo.php?idsite=18&amp;rec=1" className='d-none' alt="" />
        </p>
      </noscript>
      <div className="container-fluid">
        {getTheme(props.host) === 1 ? (
          <img className={css.flag} src="/afghanistan-flag-icon-32.png" alt="me" width="64" height="64" />
        ) : (
          <img className={css.flag} src="/ukraine-flag-icon-32.png" alt="me" width="64" height="64" />
        )}
        <Link href="/">
          <a className="navbar-brand">MiCompass</a>
        </Link>
        <div className={`collapse navbar-collapse collapse ${navbar ? `show` : ``}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-lg-0">
            {!auth.email ? (
              <>
                <li className='nav-item'>
                  <Link href="/register">
                    <a className="nav-link">Register</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href="/login">
                    <a className="nav-link">Login</a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link href="/dashboard">
                    <a className="nav-link">Flowbuilder</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href="/history">
                    <a className="nav-link">History</a>
                  </Link>
                </li>
              </>
            )}
            <li className='nav-item'>
              <Link href="/about">
                <a className="nav-link">About</a>
              </Link>
            </li>
            <li className='nav-item'>
              {state.lang && state.lang !== "en" ? (
                <a href='#' className="nav-link" onClick={(e) => switchLanguage(e, 'en')}>EN</a>
              ) : (
                <a href='#' className="nav-link" onClick={(e) => switchLanguage(e, 'af')}>AF</a>
              )}
            </li>
          </ul>
          {auth.email ? (
            <ul className="navbar-nav ">
              <span className="navbar-text">{auth.email}</span>
              <li className="nav-item">
                <a className="nav-link"
                  href="#"
                  onClick={() => {
                    authDispatch({
                      type: 'removeAuthDetails'
                    });

                    tokenService.deleteToken();

                    Router.push('/');
                  }}
                >
                  Log out
                </a>
              </li>
            </ul>
          ) : null}

        </div>
        <code className='me-2'> {globalMessaging.message ? globalMessaging.message : null} </code>
        <button onClick={() => toggleNav(!navbar)} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
}

export default Header;
