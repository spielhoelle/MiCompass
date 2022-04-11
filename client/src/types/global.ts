import { NextPageContext } from 'next';

export interface IGlobalStatus {
  message: string;
}
export interface IState {
  lang: string;
}

export interface IAppContext {
  Component: any;
  ctx: NextPageContext;
}

export interface IRedirectOptions {
  ctx: NextPageContext;
  status: number;
}

export interface Answer {
  question: string,
  answer: string,
  points: number,
  index: number
};
export interface ModelQ {
  color: string
  extras: {
    customType: string
    questionidentifier: string
    questiontranslation: string
    image: string
  }
  id: string
  name: string
  ports: any[]
  portsInOrder: any[]
  portsOutOrder: any[]
  selected: boolean
  type: string
  x: number
  y: number
}
export interface ModelA {
  color: string
  extras: {
    customType: string
    answertranslation: string
    answeridentifier: string
    points: number
    freeanswer: boolean
    freeanswer_type: string
    dropdown: boolean
  }
  id: string
  name: string
  ports: any[]
  portsInOrder: any[]
  portsOutOrder: any[]
  selected: boolean
  type: string
  x: number
  y: number
}
export interface QA {
  question: ModelQ;
  answers: ModelA[];
}
export interface History extends QA {
  choosenAnswer: ModelA;
  choosenAnswerValue: string;
}
export interface IAnswer {
  index: number,
  answer: string,
  points: number,
  question: string,
}
export interface IAction {
	type: ActionType;
	payload: IAuthInfo;
}
export interface IRegisterIn {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface ILoginIn {
  email: string;
  password: string;
}
export interface IAuthInfo {
  email: string;
}
[]