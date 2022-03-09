import { PortModelAlignment } from '@projectstorm/react-diagrams';
import React, { useState, useEffect, useRef } from 'react';
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget, DeleteItemsAction, DeserializeEvent } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';
import { CustomNodeModel } from './CustomNode/CustomNodeModel';
import { CustomNodeFactory } from './CustomNode/CustomNodeFactory';
import { CustomPortFactory } from './CustomNode/CustomPortFactory';
import { CustomPortModel } from './CustomNode/CustomPortModel';
import FetchService from '../services/Fetch.service';
import { useGlobalMessaging } from '../services/GlobalMessaging.context';
import Router from 'next/router';
import { useAuth } from '../services/Auth.context';
import TokenService from '../services/Token.service';
const engine = createEngine({ registerDefaultDeleteItemsAction: false });
class StartNodeModel extends DiagramModel {
  extras: any
  label: any
  icon: any
  name: string

  serialize() {
    return {
      ...super.serialize(),
      extras: this.extras,
      label: this.label,
      icon: this.icon,
    };
  }
  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.extras = event.data.extras;
    this.label = event.data.label;
    this.icon = event.data.icon;
  }
}

const model = new StartNodeModel();
engine
  .getPortFactories()
  .registerFactory(new CustomPortFactory('tommy', config => new CustomPortModel(PortModelAlignment.LEFT)));
engine.getNodeFactories().registerFactory(new CustomNodeFactory());
engine.setModel(model);

const CanvasWrapper = styled.div`
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  & > div {
    height: 100%;
    width: 100%;
    background: white;
  }
`
const Loader = styled.section<{ loading: boolean }>`
  opacity: ${props => props.loading ? 0.8 : 0};
  pointer-events: ${props => props.loading ? `all` : `none`};
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
  div {
    left: 50%;
    opacity: .7;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%) scale(4);
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgoKPCEtLSAKUHJlbG9hZGVyIHNjYWxhYmxlIGdyYXBoaWNzCmF1dGhvcjogSm9yZ2UgQy4gUy4gQ2FyZG9zbwpkYXRlOiAyMDEyIE9jdCAwNwotLT4KCjxnPgoJPGRlZnM+CgkJPGNsaXBQYXRoIGlkPSJjbGlwIj4KCQkJPHBhdGggZD0iTSA1MCA1MCBMIDM1IDAgTCA2NSAwIHoiLz4KCQk8L2NsaXBQYXRoPgoJCgkJPGVsbGlwc2UgaWQ9Ik15RWxsaXBzZSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXApIiBjeD0iNTAiIGN5PSI1MCIgcng9IjQwIiByeT0iNDAiIHN0eWxlPSJmaWxsOm5vbmU7IHN0cm9rZTojYWFhIiBzdHJva2Utd2lkdGg9IjEwIi8+Cgk8L2RlZnM+CgoKPHVzZSB4bGluazpocmVmPSIjTXlFbGxpcHNlIi8+Cjx1c2UgeGxpbms6aHJlZj0iI015RWxsaXBzZSIgdHJhbnNmb3JtPSJyb3RhdGUoNDAgNTAgNTApIi8+Cjx1c2UgeGxpbms6aHJlZj0iI015RWxsaXBzZSIgdHJhbnNmb3JtPSJyb3RhdGUoODAgNTAgNTApIi8+Cjx1c2UgeGxpbms6aHJlZj0iI015RWxsaXBzZSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDUwIDUwKSIvPgo8dXNlIHhsaW5rOmhyZWY9IiNNeUVsbGlwc2UiIHRyYW5zZm9ybT0icm90YXRlKDE2MCA1MCA1MCkiLz4KPHVzZSB4bGluazpocmVmPSIjTXlFbGxpcHNlIiB0cmFuc2Zvcm09InJvdGF0ZSgyMDAgNTAgNTApIi8+Cjx1c2UgeGxpbms6aHJlZj0iI015RWxsaXBzZSIgdHJhbnNmb3JtPSJyb3RhdGUoMjQwIDUwIDUwKSIvPgo8dXNlIHhsaW5rOmhyZWY9IiNNeUVsbGlwc2UiIHRyYW5zZm9ybT0icm90YXRlKDI4MCA1MCA1MCkiLz4KPHVzZSB4bGluazpocmVmPSIjTXlFbGxpcHNlIiB0cmFuc2Zvcm09InJvdGF0ZSgzMjAgNTAgNTApIi8+CgoKPGVsbGlwc2UgY2xpcC1wYXRoPSJ1cmwoI2NsaXApIiBjeD0iNTAiIGN5PSI1MCIgcng9IjQwIiByeT0iNDAiIHN0eWxlPSJmaWxsOm5vbmU7IHN0cm9rZTpibGFjayIgc3Ryb2tlLXdpZHRoPSIxMiI+Cgk8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIGF0dHJpYnV0ZVR5cGU9IlhNTCIgdHlwZT0icm90YXRlIiB2YWx1ZXM9IjAgNTAgNTA7IDQwIDUwIDUwOyA4MCA1MCA1MDsgMTIwIDUwIDUwOyAxNjAgNTAgNTA7IDIwMCA1MCA1MDsgMjQwIDUwIDUwOyAyODAgNTAgNTA7IDMyMCA1MCA1MDsgMzYwIDUwIDUwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYWRkaXRpdmU9InJlcGxhY2UiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgZmlsbD0iZnJlZXplIi8+CjwvZWxsaXBzZT4gIAogIDwvZz4KPC9zdmc+");
    width: 3em;
    height: 3em;
    background-size: cover;
    background-repeat: no-repeat;
  }
`
const Pre = styled.pre`
  white-space: unset;
  padding: 10px;
  background-color: white;
`
const colorDropdown = "rgb(170, 182, 1)"
const colorFreeanswer = "rgb(182, 133, 1)"
const colorAnswer = "rgb(255, 204, 1)"
const colorError = "rgb(255,0,0)"
const questioncolor = "rgb(0, 128, 129)"
function QuestionsDiagram() {
  let [loading, setloading] = useState(true)
  const emptyForm = {
    "flowname": "",
    "active": false,
    "renderselector": "",
    "question": "",
    'questionidentifier': "",
    'questiontranslation': "",
    "answer": "",
    "answeridentifier": "",
    "answertranslation": "",
    "freeanswer": false,
    "freeanswer_type": "text",
    "dropdown": false
  }
  let [form, setForm] = useState(emptyForm)
  let formRef = useRef(form)
  let [button, setbutton] = useState('Add')
  let [nodevisibility, setnodevisibility] = useState(true)
  let [answersvisiblity, setanswersvisiblity] = useState(false)
  let [allFlows, setallFlows] = useState([])
  const [authState, authDispatch] = useAuth();
  const tokenService = new TokenService();
  let [answers, setanswers] = useState([])
  let [currentModelId, setmodelState] = useState("")
  let [error, seterror] = useState([])
  const [messageState, messageDispatch] = useGlobalMessaging();
  useEffect(() => {
    formRef.current = form
  }, [form])

  const addEventListeners = (name) => {
    Object.values(model.getActiveNodeLayer().getModels()).forEach((currentNode) => {
      currentNode.registerListener({
        eventDidFire: (e: any) => {
          e.stopPropagation();
          e.isSelected ? setbutton('update') : setbutton('add')
          if (e.function === "selectionChanged") {
            let relatedQuestion
            if (e.isSelected) {
              const formFromClickedNode = {
                "question": currentNode.getOptions().extras.customType === "question" ? (currentNode as any).getOptions().name : relatedQuestion ? relatedQuestion.options.name : "",
                'questionidentifier': currentNode.getOptions().extras.customType === "question" ? currentNode.getOptions().extras.questionidentifier : relatedQuestion ? relatedQuestion.options.name : "",
                'questiontranslation': currentNode.getOptions().extras.customType === "question" ? currentNode.getOptions().extras.questiontranslation : relatedQuestion ? relatedQuestion.options.extras.questiontranslation : "",
                "answer": currentNode.getOptions().extras.customType === "answer" ? (currentNode as any).getOptions().name : "",
                "answeridentifier": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.answeridentifier : "",
                "answertranslation": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.answertranslation : "",
                "freeanswer": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.freeanswer : "",
                "dropdown": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.dropdown : "",
                "freeanswer_type": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.freeanswer_type : "text",
                "flowname": name
              }
              setForm({ ...formRef.current, ...formFromClickedNode })
            }
            else {
              const emptyFormClone = { ...emptyForm }
              delete emptyFormClone.flowname
              delete emptyFormClone.renderselector
              setForm({ ...formRef.current, ...emptyFormClone })
            }
          }
        }
      });
    });
  }
  useEffect(() => {
    FetchService.isofetchAuthed('/flows/get', undefined, 'GET')
      .then(res => {
        if (res.payload?.model) {
          var searchParams = new URLSearchParams(window.location.search);
          const cachedFlow = searchParams.get("flow");
          setallFlows(res.payload.model)
          const initialModel = res.payload.model.find(f => f.id === cachedFlow) || res.payload.model[0]
          if (initialModel.data) {
            model.deserializeModel(initialModel.data, engine);
          }
          setmodelState(initialModel.id)
          addEventListeners(initialModel.flowname)
          setForm({
            ...form,
            flowname: initialModel.flowname,
            active: initialModel.active,
            renderselector: initialModel.renderselector
          })
          engine.setModel(model);
        } else {
          console.log("no model");
          setloading(false)
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setloading(false)
      })
  }, [])

  const addQuestion = (e) => {
    e.preventDefault()
    const selectedNodes = Object.values(engine.getModel().getActiveNodeLayer().getModels()).filter(i => i.getOptions().selected)
    let node
    if (selectedNodes.length === 1) {
      node = selectedNodes[0]
      node.options.name = form['question']
      node.options.extras.questionidentifier = form['questionidentifier']
      node.options.extras.questiontranslation = form['questiontranslation']
    } else {
      node = new CustomNodeModel({
        name: `${e.target.elements.addquestion.value}`,
        color: e.target.elements.addquestion.dataset.color,
        extras: {
          customType: e.target.elements.addquestion.dataset.type,
          questionidentifier: e.target.elements.addquestionidentifier.value,
          questiontranslation: e.target.elements.addquestiontranslation.value
        }
      });
      node.setPosition(engine.getCanvas().offsetWidth / 2, engine.getCanvas().offsetHeight / 2);
      node.addInPort('In');
      node.addOutPort('Out');
    }
    model.addAll(node);
    engine.setModel(model);
  }
  const addAnswer = (e) => {
    e.preventDefault()
    const selectedNodes = Object.values(engine.getModel().getActiveNodeLayer().getModels()).filter(i => i.getOptions().selected)
    let node
    if (selectedNodes.length === 1) {
      node = selectedNodes[0]
      node.options.name = form['answer']
      node.options.extras.dropdown = form['dropdown']
      node.options.extras.freeanswer = form['freeanswer']
      node.options.extras.answeridentifier = form['answeridentifier']
      node.options.extras.answertranslation = form['answertranslation']
      node.options.extras.freeanswer_type = form['freeanswer_type']
    } else {
      node = new CustomNodeModel({
        name: e.target.elements.answer.value,
        color: !!e.target.elements.freeanswer && !!e.target.elements.freeanswer.checked ? colorFreeanswer : !!e.target.elements.dropdown.checked ? colorDropdown : e.target.elements.answer.dataset.color,
        extras: {
          customType: e.target.elements.answer.dataset.type,
          freeanswer: !!e.target.elements.freeanswer && !!e.target.elements.freeanswer.checked,
          freeanswer_type: !!e.target.elements.freeanswer_type && !!e.target.elements.freeanswer_type.selectedOptions[0].value,
          dropdown: !!e.target.elements.dropdown && !!e.target.elements.dropdown.checked,
          answeridentifier: e.target.elements.answeridentifier.value,
          answertranslation: e.target.elements.answertranslation.value
        }
      });
      node.setPosition(engine.getCanvas().offsetWidth / 2, engine.getCanvas().offsetHeight / 2);
      node.addInPort('In');
      node.addOutPort('Out');
    }
    model.addAll(node);
    engine.setModel(model);
  }
  const saveModel = () => {
    setloading(true)
    var nodes = Object.values(model.getLayers().find(layer => layer.getOptions().type === "diagram-nodes").getModels())
    let errorNodes = []

    var checkQABalance = (question) => {
      return Object.values(question.portsOut[0].links).map((link: any) => {
        if (link.targetPort.parent.options.extras.customType !== "answer") {
          engine.getModel().getNode(link.targetPort.parent.options.id).setSelected(true);
          engine.getModel().getNode(link.targetPort.parent.options.id).getOptions().extras.color = "rgb(255,0,0)"
          return link.targetPort.parent
        }
      }).filter(l => !!l)
    }

    const questions = nodes.filter(n => n.getOptions().extras.customType !== "answer")
    questions.map(q => {
      errorNodes = [...errorNodes, ...checkQABalance(q)]
    })
    seterror([...errorNodes, `Answer followes to answer for nodes: ${errorNodes.map(e => e.options.name + ', ')}`])
    if (errorNodes.length === 0) {
      seterror(undefined)
    }
    const payload = {
      id: currentModelId,
      flowname: form.flowname,
      renderselector: form.renderselector,
      model: model.serialize(),
      active: form.active
    }
    FetchService.isofetchAuthed(
      `/flows/save`,
      payload,
      "POST",
    )
      .then(res => {
        setloading(false)
        if (res.success !== false) {
          const oldFlow = { ...allFlows.find(f => f.id === res.flow.data.id) }
          const newFlow = { ...oldFlow, ...res.flow.data }
          const flowsClone = [...allFlows]
          flowsClone[flowsClone.findIndex(f => f.id === res.flow.data.id)] = newFlow
          setallFlows(flowsClone)
          messageDispatch({
            type: 'setMessage',
            payload: {
              message: 'Flow saved'
            }
          });
        } else {
          messageDispatch({
            type: 'setMessage',
            payload: {
              message: res.message
            }
          });
          setTimeout(() => {
            Router.push('/login');
            authDispatch({
              type: 'removeAuthDetails'
            });
            tokenService.deleteToken();
          }, 1000);
        }
      })
  }

  const cloneSelected = () => {
    setloading(true)
    let itemMap = {};
    model.getSelectedEntities().filter(m => m.getOptions().type === "custom_question_node").map(item => {
      let newItem = item.clone(itemMap)
      model.addNode(newItem)
      newItem.setPosition(newItem.getX() + 20, newItem.getY() + 20)
      engine.setModel(model);
      item.setSelected(!1)
      setloading(false)
    })
  }

  engine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [8], modifiers: { shiftKey: true } }));

  return (
    <div className="h-100 d-flex flex-column">
      <h2>Contactforms
        <button className="btn btn-secondary badge mx-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="Link questions to one or multiple answers. If a question is followed by a freeanswer, it should be the only anwer of that question" data-original-title="" title=""> ?
        </button>
        <button className={`btn btn-outline-secondary mr-2`} onClick={e => {
          if (confirm("This will create a new empty flow in the database. Sure?")) {
            if (form.flowname) {
              setloading(true)
              const newModel = new StartNodeModel();

              const payload = {
                id: "",
                flowname: "New Flow",
                renderselector: "",
                model: newModel.serialize(),
              }
              FetchService.isofetchAuthed(
                `/flows/save`,
                payload,
                "POST",
              )
                .then(res => {
                  if (res.error) {
                    seterror([...error, res.error])
                  } else {
                    // setallFlows([...allFlows, res.payload])
                    // setForm({
                    //   ...formRef.current,
                    //   flowname: res.payload.name,
                    //   active: false,
                    //   renderselector: ""
                    // })
                    // setmodelState(res.payload.model.id)
                    // model.deserializeModel(res.payload.model, engine);
                    // engine.setModel(newModel)
                  }
                  setloading(false)
                })
            } else {
              seterror([...error, `Name must be provided`])
            }
          }
        }}>Add new Flow</button>
        <button className={`btn btn-secondary mr-2 word-break-break-all`} onClick={e => {
          setnodevisibility(!nodevisibility)
        }}>{!nodevisibility ? `Configure current flow ` : `Hide nodespanel`} </button>

      </h2>



      <div className={!answersvisiblity ? `d-none` : ``}>
        <div className={`card`}>
          {answers.map((a, i) => (
            <Pre key={i} className={""}>{JSON.stringify(a.answers)}</Pre>
          ))}
        </div>
      </div>
      <div className={!nodevisibility ? `d-none` : ``}>
        <form onSubmit={addQuestion}>
          <div className="row form-row align-items-end">
            <div className="col-3 flex-column d-flex">
              <label htmlFor="flowselector">flowselector</label>
              <select
                id="flowselector"
                className={`form-control w-100 mr-2`}
                value={currentModelId}
                onChange={e => {
                  const theModelToSet = allFlows.find(f => f.id === Number(e.target.selectedOptions[0].value))
                  var searchParams = new URLSearchParams(window.location.search);
                  searchParams.set("flow", theModelToSet.id);
                  window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
                  if (theModelToSet.data) {
                    model.deserializeModel(theModelToSet.data, engine);
                    setForm({ ...form, flowname: theModelToSet.flowname, active: theModelToSet.active, renderselector: theModelToSet.renderselector })
                    setmodelState(theModelToSet.id)
                    engine.setModel(model);
                  } else {
                    const newModel = new StartNodeModel();
                    model.deserializeModel((newModel as any), engine);
                    engine.setModel(newModel)
                  }
                  addEventListeners(theModelToSet.flowname)
                }}>
                <option disabled>select flow...</option>
                {allFlows.map((f, i) => (
                  <option key={i} value={f.id}>{f.flowname}</option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="flowname">Flow name</label>
              <input className="form-control" id="flowname" name="flowname" value={form['flowname']} onChange={(e) => {
                e.stopPropagation();
                setForm({ ...form, [e.target.name]: e.target.value })
              }} />
            </div>
            <div className="col-3 ">
              <label htmlFor="renderselector">Flow renderselector</label>
              <input className="form-control" id="renderselector" name="renderselector" value={form['renderselector']} onChange={(e) => {
                e.stopPropagation();
                setForm({ ...form, [e.target.name]: e.target.value })
              }} />
            </div>
            <div className="col-3 px-3 align-items-center d-flex">
              <input
                defaultChecked={form['active']}
                type="checkbox" name="active" className="form-check-input"
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.checked })
                }} style={{ borderColor: colorAnswer, borderStyle: "solid" }} id="active" />
              <label className="form-check-label" htmlFor="active">Active?</label>

              <button className="btn btn-secondary badge ml-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="That results in sending a alternative email to settings.tourmailreceiver and prevents a redirect to /thank-you"> ? </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <label htmlFor="addquestion">Add Question</label>
              <input className="form-control" name="question" type="text" value={form['question']}
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.value })
                }} data-type="question" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestion" required />
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="addquestiontranslation">DE Questiontranslation</label>
              <input className="form-control" name="questiontranslation" type="text" value={form['questiontranslation']}
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.value })
                }} data-type="questiontranslation" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestiontranslation" required />
            </div>
            <div className="col-md-6 col-lg-3">
              <div className=''>
                <div className="flex-grow-1">
                  <label htmlFor="addquestionidentifier">Questionidentifier</label>
                  <input className="form-control" name="questionidentifier" type="text" value={form['questionidentifier']}
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }} data-type="questionidentifier" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestionidentifier" required />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 align-items-end d-flex justify-content0-end">
              <button className="btn btn-primary ml-1" type="submit">{button}</button>
            </div>
          </div>
        </form>

        <form className="" onSubmit={addAnswer}>
          <div className=" row">
            <div className="col-md-6 col-lg-3">
              <label htmlFor="addanswer">Add Answer</label>
              <input className="form-control w-99" name="answer" value={form['answer']}
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.value })
                }} type="text" data-type="answer" data-color="rgb(256, 204, 1)" style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="addanswer" />
            </div>
            <div className="col-md-6 col-lg-3">
              <div>
                <label htmlFor="answertranslation">Answertranslation</label>
                <input className="form-control w-99" name="answertranslation" type="text" value={form['answertranslation']}
                  onChange={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }} data-type="answertranslation" data-color={questioncolor} style={{ borderColor: "rgb(256, 204, 1)", borderStyle: "solid" }} id="answertranslation" required />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className='flex-grow-1'>
                <div>
                  <label htmlFor="answeridentifier">Answeridentifier</label>
                  <input className="form-control " name="answeridentifier" type="text" value={form['answeridentifier']}
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }} data-type="answeridentifier" data-color={questioncolor} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="answeridentifier" required />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="flex-grow-1 d-flex align-items-end">
                <div className="w-100">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    className={`w-100 mr-2 form-control`}
                    value={form['freeanswer_type']}
                    onChange={e => {
                      setForm({ ...form, freeanswer_type: e.target.selectedOptions[0].value, dropdown: false, freeanswer: true })
                    }}>
                    <option disabled>select type</option>
                    {["text", "email", "number", "tel", "textarea", "hidden"].map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button className="btn btn-primary ml-1" type="submit">{button}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex w-100 mt-2">
            <div className="form-check d-flex align-items-center mr-3 mb-3">
              <input
                checked={form['freeanswer']}
                name='freeanswer'
                type="checkbox" className="form-check-input"
                onChange={(e) => {
                  e.stopPropagation();

                  setForm({ ...form, [e.target.name]: e.target.checked, dropdown: false })
                }} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="freeanswer" />
              <label className="form-check-label" htmlFor="freeanswer">Free answer</label>
              <button className="btn btn-secondary badge ml-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="If checked you can split by a ':' between the fieldlabel and the placeholder. Eg: fieldlabel:placeholder or Phone:+490987654321" data-original-title="" title=""> ? </button>
            </div>
            <div className="form-group form-check d-flex align-items-center mr-3 mb-3">
              <input
                checked={form['dropdown']}
                name='dropdown'
                type="checkbox" className="form-check-input"
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.checked, freeanswer: false })
                }} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="dropdown" />
              <label className="form-check-label" htmlFor="dropdown">Is dropdown</label>
              <button className="btn btn-secondary badge ml-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="If checked, the name field gets more complex. Use a label followed by semicolon and then a comma seperated list to define the dropdown and its items. You can provide a optional dropdown label also with putting it in ().Eg: 'Whats your language level: A1(Beginner), A2, B1, B2(Mother tongue)' - or: 'State: Berlin(Haupstadt), Bayern'." data-original-title="" title=""> ? </button>
            </div>
          </div>
        </form>

        <button className="btn btn-primary btn-sm mr-2"
          disabled={loading}
          onClick={() => {
            cloneSelected()
          }}>{loading ? "Loading" : "Clone selected"}</button>
        <button className="btn btn-success btn-sm"
          disabled={loading}
          onClick={() => {
            saveModel()
          }}>{loading ? "Loading" : "Save"}</button>
      </div>
      {error && error.length > 0 && (
        <div className=" m-0 mr-3 alert alert-danger">
          <button type="button" className="close" onClick={e => {
            seterror([])
          }}>
            <span aria-hidden="true">&times;</span>
          </button>
          Errors: {error.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
      <CanvasWrapper >
        <CanvasWidget engine={engine} />
        <Loader loading={loading} >
          <div></div>
        </Loader>
      </CanvasWrapper>
    </div>
  );
}

export default QuestionsDiagram;
