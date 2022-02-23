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
    }).then(function (flow: FlowInterface[]) {
      if (flow.length === 0) {
        return db.flows.create({
          flowId: that.data.flowId,
          flowname: that.data.flowname,
          renderselector: that.data.renderselector,
          data: that.data.model
        });

      } else {
        return db.flows.update({
          flowId: that.data.flowId,
          flowname: that.data.flowname,
          renderselector: that.data.renderselector,
          data: that.data.model
        }, {
          where: { flowId: that.data.flowId }
        });
      }
    }).catch((err: string) => {
      console.log(err);
    });

  }

  getFlows() {
    return db.flows.findAll({})
  }

  getFlow(flowId: number) {
    return db.flows.findOne({
      raw: true,
      where: { flowId: flowId },
      attributes: ['data']
    });
  }
}

export { Flow };
