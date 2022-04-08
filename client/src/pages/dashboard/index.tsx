import dynamic from 'next/dynamic'
import css from './index.module.scss';

import { NextPageContext } from 'next';
import * as React from 'react';

import TokenService from '../../services/Token.service';

import PageContent from '../../components/PageContent';
const FlowBuilder = dynamic(
  () => import('../../components/FlowBuilder'),
  { ssr: false }
)
function Dashboard(props) {
  return (
    <PageContent props={props}>
      <FlowBuilder />
    </PageContent>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  const tokenService = new TokenService();
  await tokenService.authenticateTokenSsr(ctx);

  return {};
};

export default Dashboard;
