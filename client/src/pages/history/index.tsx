import css from './index.module.scss';
import TokenService from '../../services/Token.service';
import { NextPageContext } from 'next';
import FetchService from '../../services/Fetch.service';
import React, { useEffect, useState, useRef } from 'react';
import PageContent from '../../components/PageContent';
import { calcResults } from '../../components/helpers';
import { IAnswer } from '../../types/global'


function History(props) {
  const [answerHistory, setHistory] = useState([]);
  const [answerOverview, setAnswerOverview] = useState({});
  useEffect(() => {
    FetchService.isofetchAuthed('/answers/get', undefined, 'GET')
      .then((res) => {
        const result = res.payload.reduce((acc, submission) => {
          const qualifiedAnswers = Object.values(submission.data).filter((a: IAnswer) => a.points > -1)
          qualifiedAnswers.length > 0 && Object.values(qualifiedAnswers).map((qBatch: IAnswer) => {
            if (!acc[qBatch.question]) {
              acc[qBatch.question] = [{
                answer: qBatch.answer,
                answered: 1,
              }]
            } else {
              const foundAnswer = acc[qBatch.question].findIndex(a => a.answer === qBatch.answer)
              if (foundAnswer !== -1) {
                acc[qBatch.question][foundAnswer].answered++
              } else {
                acc[qBatch.question].push({
                  answer: qBatch.answer,
                  answered: 1,
                })
              }
            }
          })
          return acc
        }, [])
        setAnswerOverview(result)

        const history = res.payload.map(r => {
          r.data = Object.values(r.data).filter((a: IAnswer) => a.points > -1 || /^[^@\s]+@[^@\s]+\.\w+$/.test(a.answer))
          if (r.data.length > 0) {
            return r
          }
        }).filter(i => !!i)
        setHistory(history)
      }).catch(err => {
        console.log(err);
      })
  }, [])
  return (
    <PageContent props={props}>
      <h3>Overview</h3>
      {Object.keys(answerOverview).map((item, index) => (
        <div className='mb-4'>
          <h4>{item.slice(0, 100)}</h4>
          {answerOverview[item].map((item2, index) => (
            <div>
              {item2.answer}: {item2.answered}
            </div>
          ))}
          {Object.keys(answerOverview).length !== index - 1 && <hr />}
        </div>
      ))}
      <h3 className={css.example}>History</h3>
      {answerHistory.map((item, index) => (
        <div className="mb-3" key={index}>
          <span className='badge bg-primary me-2'>
            ID: {item.id}
          </span>
          <span className='badge bg-primary'>
            createdAt: {item.createdAt.replace("T", " ").replace("Z", "").slice(0, 16)}
          </span>
          <span className="badge bg-primary ms-2">{calcResults(item.data).title}</span> with <span className={`badge rounded-pill ${calcResults(item.data).class}`}>{calcResults(item.data).reachedPoints}</span> points.
          {item.data.map((q, a) => (
            <div>{q.index}: <span className='badge bg-light text-dark'>{q.answer} {q.points > -1 && q.points} </span></div>
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
