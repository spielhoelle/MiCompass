import css from './PageContent.module.scss';
import { useRouter } from 'next/router'
import Head from './Head';
import * as React from 'react';

function PageContent({ children }: any) {
  const router = useRouter()
  return (
    <React.Fragment>
      <Head />
      <div className={`${css.pageContent} ${router.pathname !== "/dashboard" ? `container` : ``}`}>{children}</div>
    </React.Fragment>
  );
}

export default PageContent;
