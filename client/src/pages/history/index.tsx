import css from './index.module.scss';
import TokenService from '../../services/Token.service';
import { NextPageContext } from 'next';
import FetchService from '../../services/Fetch.service';
import React, { useEffect, useState, useRef } from 'react';
import PageContent from '../../components/PageContent';

function History() {
  const [answerHistory, setHistory] = useState([]);
  const [answerOverview, setAnswerOverview] = useState({});
  useEffect(() => {
    FetchService.isofetchAuthed('/answers/get', undefined, 'GET')
      .then((res) => {
        const mappedHistory = res.payload.map((item) => {
          return { ...item, data: JSON.parse(item.data) }
        })
        setHistory(mappedHistory)
        const overview = mappedHistory.reduce((acc, item) => {
          Object.keys(item.data).map(q => {
            if (acc[q] === undefined) {
              acc[q] = []
            }
            if (acc[q][item.data[q]] === undefined) {
              acc[q][item.data[q]] = 0
            }
            acc[q][item.data[q]]++
          })
          return acc
        }, {})
        setAnswerOverview(overview)
      }).catch(err => {
        console.log(err);
      })
  }, [])
  return (
    <PageContent>
      <h3>Overview</h3>
      {Object.keys(answerOverview).map((item, index) => (
        <div>
          <h2>{item.slice(0, 50)}</h2>
          {Object.keys(answerOverview[item]).map((item2, index) => (
            <div>
              {item2}: {answerOverview[item][item2]}
            </div>
          ))}
        </div>
      ))}
      <hr />
      <h3 className={css.example}>History</h3>
      {answerHistory.map((item, index) => (
        <div className="mb-3" key={index}>
          <span className='badge bg-primary me-2'>
            ID: {item.id}
          </span>
          <span className='badge bg-primary'>
            createdAt: {item.createdAt.replace("T", " ").replace("Z", "").slice(0, 16)}
          </span>
          {Object.keys(item.data).map((q, a) => (
            <div>{q}: <span className='badge bg-light text-dark'>{item.data[q]}</span></div>
          ))}
        </div>
      ))}

    </PageContent>
  );
}

History.getInitialProps = async (ctx: NextPageContext) => {
  const tokenService = new TokenService();
  await tokenService.authenticateTokenSsr(ctx);

  return {};
};
export default History;
