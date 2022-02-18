import css from './Head.module.scss';

import Head from 'next/head';
import React, { useState } from 'react';
import Router from 'next/router';

import TokenService from '../services/Token.service';
import { useAuth } from '../services/Auth.context';
import { useGlobalMessaging } from '../services/GlobalMessaging.context';
import Link from 'next/link';

interface IProps { }

function Header(props: IProps) {
  const tokenService = new TokenService();
  const [globalMessaging, messageDispatch] = useGlobalMessaging();
  const [auth, authDispatch] = useAuth();
  const [navbar, toggleNav] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Head>
        <title>Next.js, Typescript and JWT boilerplate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">MiCompass</a>
        </Link>
        <a href="#"> {globalMessaging.message ? <p className="globalStatus">{globalMessaging.message}</p> : null} </a>
        <button onClick={() => toggleNav(!navbar)} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse collapse ${navbar ? `show` : ``}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
          </ul>
          {auth.email ? (
            <ul className="navbar-nav ">
              <span className="navbar-text">Logged in with user: {auth.email}</span>
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
      </div>
    </nav>
  );
}

export default Header;
