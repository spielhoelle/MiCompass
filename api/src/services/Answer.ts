import db from '../db/models';

class Answer {
  public data: string;
  public flow: string;

  constructor(flow: string, data: string | null) {
    this.flow = flow;
    if (data) {
      this.data = data;
    }
  }

  saveAnswer() {
    return db.answers.create({
      flow: this.flow,
      data: this.data
    });
  }
  getAnswers() {
    return db.answers.findAll({})
  }
}

export { Answer };
