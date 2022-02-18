import css from './index.module.scss';
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
            if (acc[item.data[q]] === undefined) {
              acc[item.data[q]] = 0
            }
            acc[item.data[q]]++
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
          {item}: {answerOverview[item]}
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

export default History;