import css from './index.module.scss';

import PageContent from '../../components/PageContent';

import * as React from 'react';

function About() {
  return (
    <PageContent>
      <h2 className={css.example}>About!</h2>
      <p>
        MiCompass is a virtual migration guide that covers five key areas worth considering before you decide to make a move.
      </p>
      <p>
        This game will help build an understanding of common misperceptions about seeking asylum in Europe. The purpose is not to dissuade people with protection needs from leaving but to enable them to take an informed decision knowing what lies ahead.
      </p>
      <p>
        No personal profile data will be collected by playing this game.
      </p>
      <a href="https://internews.org/" target='_blank' ></a>

    </PageContent>
  );
}

export default About;
