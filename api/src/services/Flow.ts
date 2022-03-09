import db from '../db/models';
interface FlowInterface {

  model: {
    dataValues: {
      id: number,
      flowId: string,
      flowname: string;
      renderselector: string;
      data: any,
      createdAt: string,
      updatedAt: string
    },
    _previousDataValues: {
      id: number,
      flowId: string,
      flowname: string;
      renderselector: string;
      data: any,
      createdAt: string,
      updatedAt: string
    },
    _changed: Object,
    _options: {
      isNewRecord: boolean,
      _schema: any,
      _schemaDelimiter: string,
      raw: boolean,
      attributes: any
    },
    isNewRecord: boolean
  }
}
class Flow {
  data: any
  constructor(data: string | null) {
    if (data) {
      this.data = data;
    }
  }

  saveFlow() {
    const that = this
    return db.flows.findAll({
      limit: 1,
      where: {
        //your where conditions, or without them if you need ANY entry
      },
      order: [['createdAt', 'DESC']]
    }).then(async function (flow: FlowInterface[]) {
      if (!that.data.id) {
        return db.flows.create({
          flowname: that.data.flowname,
          renderselector: that.data.renderselector,
          data: that.data.model
        });
      } else {
        return db.flows.update({
          flowname: that.data.flowname,
          renderselector: that.data.renderselector,
          data: that.data.model
        }, {
          where: { id: Number(that.data.id) }
        });
      }
    }).catch((err: string) => {
      console.log(err);
    });

  }
  getFlows() {
    return db.flows.findAll({})
  }

  getFlow(id: number) {
    return db.flows.findOne({
      raw: true,
      where: { id: id },
      attributes: ['data']
    });
  }
}

export { Flow };
