import db from '../db/models';

class Answer {
  public data: string;

  constructor(data: string | null) {
    if (data) {
      this.data = data;
    }
  }

  saveAnswer() {
    return db.answers.create({
      data: this.data
    });
  }
  getAnswers() {
    return db.answers.findAll({})
  }
}

export { Answer };
