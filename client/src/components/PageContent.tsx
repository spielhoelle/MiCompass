import css from './PageContent.module.scss';
import { useRouter } from 'next/router'
import Head from './Head';
import { getTheme } from './helpers';
import React, { useEffect, useState } from 'react';

function PageContent({ children, props }: any) {
  const router = useRouter()
  const theme = getTheme(props.host) === 1 ? 'afghan' : 'ukrain'
  return (
    <React.Fragment>
      <div className={`${css[theme]}`}>
        <div className={`${css.pageContent} ${router.pathname !== "/dashboard" ? `container` : ``} `}>
          <Head props={props} />
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}

export default PageContent;
