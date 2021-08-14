import css from './Head.module.scss';

import Head from 'next/head';
import * as React from 'react';
import Router from 'next/router';

import TokenService from '../services/Token.service';
import { useAuth } from '../services/Auth.context';
import { useGlobalMessaging } from '../services/GlobalMessaging.context';

interface IProps { }

function Header(props: IProps) {
  const tokenService = new TokenService();
  const [globalMessaging, messageDispatch] = useGlobalMessaging();
  const [auth, authDispatch] = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Head>
        <title>Next.js, Typescript and JWT boilerplate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 className={'h1'}>MiCompass</h1>
      <div className="container-fluid">
        <a className="navbar-brand" href="#"> {globalMessaging.message ? <p className="globalStatus">{globalMessaging.message}</p> : null} </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                <li className="nav-item"> <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">Disabled</a> </li>
              </ul>
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
