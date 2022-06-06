import { PortModelAlignment } from '@projectstorm/react-diagrams';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget, DeleteItemsAction, DeserializeEvent, BaseModel } from '@projectstorm/react-canvas-core';
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
  display: flex;
  flex-flow: column;
  & > div {
    height: 100%;
    width: 100%;
    background: white;
  }
`
const Loader = styled.section<{ loading: boolean }>`
  opacity: ${props => props.loading ? 0.5 : 0};
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
const StyledImage = styled.img`
  max-height: 2em;
  max-width: 2em;
  object-fit: contain;
 `
const colorPointanswer = "rgb(255, 144, 0)"
const colorFreeanswer = "rgb(182, 133, 1)"
const colorDropdown = "rgb(144, 133, 1)"
const colorCondition = "rgb(144, 133, 64)"
const colorAnswer = "rgb(255, 204, 1)"
const colorError = "rgb(255,0,0)"
const questioncolor = "rgb(0, 128, 129)"
function FlowBuilder() {
  let [loading, setloading] = useState(true)
  const emptyForm = {
    "flowname": "",
    "active": false,
    "renderselector": "",
    "question": "",
    'questionidentifier': "",
    'image': "",
    'questiontranslation': "",
    "answer": "",
    "answeridentifier": "",
    "answertranslation": "",
    "points": 0,
    "freeanswer": false,
    "pointanswer": false,
    "freeanswer_type": "text",
    "dropdown": false,
    "condition": false
  }
  let [form, setForm] = useState(emptyForm)
  let formRef = useRef(form)
  let [button, setbutton] = useState('Add')
  let [nodevisibility, setnodevisibility] = useState(true)
  let nodevisibilityRef = useRef(nodevisibility)
  let [answersvisiblity, setanswersvisiblity] = useState(false)
  let [allFlows, setallFlows] = useState([])
  const [authState, authDispatch] = useAuth();
  const tokenService = new TokenService();
  let [answers, setanswers] = useState([])
  let [disabled, setdisabled] = useState(undefined)
  let [currentModelId, setmodelState] = useState("")
  let [error, seterror] = useState([])
  const [fakeState, setFakeState] = useState(false)
  const [messageState, messageDispatch] = useGlobalMessaging();
  useEffect(() => {
    formRef.current = form
  }, [form])
  useEffect(() => {
    nodevisibilityRef.current = nodevisibility
  }, [nodevisibility])
  const handleUserKeyPress = useCallback(event => {
    const { keyCode } = event;
    if (keyCode === 32 && event.target.nodeName === "BODY") {
      setnodevisibility(!nodevisibilityRef.current)
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);
  const addEventListeners = (name) => {
    Object.values(model.getActiveNodeLayer().getModels()).forEach((currentNode) => {
      currentNode.registerListener({
        eventDidFire: (e: any) => {
          e.stopPropagation();
          if (e.function === "selectionChanged") {
            e.isSelected ? setbutton('update') : setbutton('add')
            let relatedQuestion
            if (e.isSelected) {
              setdisabled(currentNode.getOptions().extras.customType === "question" ? "answer" : "question")
              const formFromClickedNode = {
                "question": currentNode.getOptions().extras.customType === "question" ? (currentNode as any).getOptions().name : relatedQuestion ? relatedQuestion.options.name : "",
                'questionidentifier': currentNode.getOptions().extras.customType === "question" ? currentNode.getOptions().extras.questionidentifier : relatedQuestion ? relatedQuestion.options.name : "",
                'image': currentNode.getOptions().extras.customType === "question" ? currentNode.getOptions().extras.image : relatedQuestion ? relatedQuestion.options.image : "",
                'questiontranslation': currentNode.getOptions().extras.customType === "question" ? currentNode.getOptions().extras.questiontranslation : relatedQuestion ? relatedQuestion.options.extras.questiontranslation : "",
                "answer": currentNode.getOptions().extras.customType === "answer" ? (currentNode as any).getOptions().name : "",
                "answeridentifier": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.answeridentifier : "",
                "answertranslation": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.answertranslation : "",
                "points": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.points : 0,
                "freeanswer": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.freeanswer : "",
                "pointanswer": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.pointanswer : "",
                "dropdown": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.dropdown : "",
                "condition": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.condition : "",
                "freeanswer_type": currentNode.getOptions().extras.customType === "answer" ? currentNode.getOptions().extras.freeanswer_type : "text",
                "flowname": name
              }
              setForm({ ...formRef.current, ...formFromClickedNode })
            }
            else {
              setdisabled(undefined)
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
          const initialModel = res.payload.model.find((f: any) => f.id === Number(cachedFlow)) || res.payload.model[0]
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
      node.options.extras.image = form['image']
    } else {
      node = new CustomNodeModel({
        name: `${e.target.elements.addquestion.value}`,
        color: e.target.elements.addquestion.dataset.color,
        extras: {
          customType: e.target.elements.addquestion.dataset.type,
          questionidentifier: e.target.elements.addquestionidentifier.value,
          image: e.target.elements.addimageselector.value,
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
  const addAnswer = (e: any) => {
    e.preventDefault()
    const selectedNodes = Object.values(engine.getModel().getActiveNodeLayer().getModels()).filter(i => i.getOptions().selected)
    let node
    if (selectedNodes.length === 1) {
      node = selectedNodes[0]
      node.getOptions().name = form['answer']
      node.getOptions().extras.dropdown = form['dropdown']
      node.getOptions().extras.condition = form['condition']
      node.getOptions().extras.freeanswer = form['freeanswer']
      node.getOptions().extras.pointanswer = form['pointanswer']
      node.getOptions().extras.answeridentifier = form['answeridentifier']
      node.getOptions().extras.answertranslation = form['answertranslation']
      node.getOptions().extras.points = form['points']
      node.getOptions().extras.freeanswer_type = form['freeanswer_type']
      node.getOptions().color = !!e.target.elements.freeanswer && !!e.target.elements.freeanswer.checked ? colorFreeanswer : !!e.target.elements.pointanswer.checked ? colorPointanswer : !!e.target.elements.dropdown.checked ? colorDropdown : !!e.target.elements.condition.checked ? colorCondition : e.target.elements.answer.dataset.color
    } else {
      node = new CustomNodeModel({
        name: e.target.elements.answer.value,
        color: !!e.target.elements.freeanswer.checked ? colorFreeanswer : !!e.target.elements.pointanswer.checked ? colorPointanswer : !!e.target.elements.dropdown.checked ? colorDropdown : e.target.elements.answer.dataset.color,
        extras: {
          customType: e.target.elements.answer.dataset.type,
          freeanswer: !!e.target.elements.freeanswer && !!e.target.elements.freeanswer.checked,
          pointanswer: !!e.target.elements.pointanswer && !!e.target.elements.pointanswer.checked,
          freeanswer_type: !!e.target.elements.freeanswer_type && !!e.target.elements.freeanswer_type.selectedOptions[0].value,
          dropdown: !!e.target.elements.dropdown && !!e.target.elements.dropdown.checked,
          condition: !!e.target.elements.condition && !!e.target.elements.condition.checked,
          answeridentifier: e.target.elements.answeridentifier.value,
          answertranslation: e.target.elements.answertranslation.value,
          points: e.target.elements.points.value
        }
      });
      node.setPosition(engine.getCanvas().offsetWidth / 2, engine.getCanvas().offsetHeight / 2);
      node.addInPort('In');
      node.addOutPort('Out');
    }
    setFakeState(!fakeState)
    checkQABalance()
    model.addAll(node);
    engine.setModel(model);
  }
  var checkQABalance = () => {
    let errorNodes = []
    var nodes = Object.values(model.getLayers().find(layer => layer.getOptions().type === "diagram-nodes").getModels())
    const questions = nodes.filter(n => n.getOptions().extras.customType !== "answer")
    const answers = nodes.filter(n => n.getOptions().extras.customType === "answer")
    const qErrorNodes = questions.map((q: any) => {
      return Object.values((q).portsOut[0].links).map((link: any) => {
        if (link.targetPort.parent.options.extras.customType !== "answer") {
          engine.getModel().getNode(link.targetPort.parent.options.id).setSelected(true);
          (engine.getModel().getNode(link.targetPort.parent.options.id).getOptions() as any).color = "rgb(255,0,0)"
          return link.targetPort.parent
        }
      }).filter(l => !!l)
    })
      .filter(l => l.length > 0)
      .flatMap(x => x)

    answers.filter((a: any) => !a.getOptions().extras.condition).map(a => {
      if (
        answers.filter(a2 => a2.getOptions().extras.answeridentifier === a.getOptions().extras.answeridentifier).length > 1
        // || 
        // check if there are more than one answer with the same identifier

        //TODO check if answer just contains condition answer
      ) {
        (a.getOptions() as any).color = "rgb(255,0,0)"
        errorNodes = [...errorNodes, (a.getOptions() as any).name]
      } else {
        let color = colorAnswer
        if (a.getOptions().extras.freeanswer) {
          color = colorFreeanswer
        } else if (a.getOptions().extras.pointanswer) {
          color = colorPointanswer
        } else if (a.getOptions().extras.dropdown) {
          color = colorDropdown
        } else if (a.getOptions().extras.condition) {
          color = colorCondition
        }
        (a.getOptions() as any).color = color
      }
    })
    const currenErrors = []
    if (qErrorNodes.length > 0) {
      currenErrors.push(`Questions have problems: ${qErrorNodes.map(e => e.options.name + ', ').join("")}`)
    }
    if (errorNodes.length > 0) {
      currenErrors.push(`Answer have overlapping answeridentifier: ${errorNodes.map(e => e + ', ').join("")}`)
    }
    seterror(currenErrors)
    if (currenErrors.length === 0) {
      seterror(undefined)
    }
  }
  const saveModel = (e) => {
    e.preventDefault()
    setloading(true)
    checkQABalance()
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
    let localModel = engine.getModel()
    localModel.getSelectedEntities()
      // .filter(m => m.getOptions().type === "custom_question_node")
      .map(item => {
        let newItem = item.clone(itemMap)
        if (newItem.options.type === "custom_question_node") {
          newItem.setPosition(newItem.getX() + 20, newItem.getY() + 20)
          localModel.addNode(newItem)
        }
        else if (newItem.options.type === 'default') {
          //TODO cloning many links is lagyy and increases time per iteration
          newItem.getPoints().map((p) => {
            p.setPosition(p.getX() + 20, p.getY() + 20);
          });
          localModel.addLink(newItem)
        }
        engine.setModel(localModel);
        engine.setModel(localModel);
        item.setSelected(!1);
        (newItem as BaseModel).setSelected(true);
      })
    setloading(false)
  }

  engine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [8], modifiers: { shiftKey: true } }));

  const file2Base64 = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = error => reject(error);
    })
  }
  const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
    return new Promise((resolve) => {
      let img = new Image()
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')
        const MAX_WIDTH = maxWidth
        const MAX_HEIGHT = maxHeight
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL())
      }
    })
  }

  return (
    <div className="h-100 d-flex flex-column ">
      <div className="container-fluid">



        <div className={!answersvisiblity ? `d-none` : ``}>
          <div className={`card`}>
            {answers.map((a, i) => (
              <Pre key={i} className={""}>{JSON.stringify(a.answers)}</Pre>
            ))}
          </div>
        </div>
        <div className={nodevisibility ? `d-none` : `position-absolute top left z-index-1`}>
          <button className='btn btn-outline-dark' onClick={(e) => setnodevisibility(!nodevisibility)}>Show nodes</button>
        </div>
        <div className={!nodevisibility ? `d-none` : ``}>
          <form onSubmit={addQuestion}>
            <div className="row form-row align-items-end">
              <div className="col-2 flex-column d-flex">
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
              <div className="col-md-6 col-lg-3">
                <label htmlFor="flowname">Flow name</label>
                <input className="form-control" id="flowname" name="flowname" value={form['flowname']} onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.value })
                }} />
              </div>
              <div className="col-md-6 col-lg-3 ">
                <label htmlFor="renderselector">Renderselector</label>
                <input className="form-control" id="renderselector" name="renderselector" value={form['renderselector']} onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.value })
                }} />
              </div>
              {/* <div className="col-3 px-3 align-items-center d-flex">
                <input
                defaultChecked={form['active']}
                type="checkbox" name="active" className="form-check-input"
                onChange={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, [e.target.name]: e.target.checked })
                }} style={{ borderColor: colorAnswer, borderStyle: "solid" }} id="active" />
                <label className="form-check-label" htmlFor="active">Active?</label>

                <button className="btn btn-secondary badge ml-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="That results in sending a alternative email to settings.tourmailreceiver and prevents a redirect to /thank-you"> ? </button>
              </div> */}

              <div className="col-md-6 col-lg-4 align-items-start d-flex justify-content-end ">
                <div className="btn-group w-100" role="group" aria-label="Basic example">
                  <button className="btn btn-primary mr-2"
                    disabled={loading}
                    onClick={() => {
                      cloneSelected()
                    }}>{loading ? "Loading" : "Clone sel."}</button>
                  <button className="btn btn-success"
                    disabled={loading}
                    onClick={(e) => {
                      saveModel(e)
                    }}>{loading ? "Loading" : "Save"}</button>
                  {/* <button className="btn btn-secondary badge mx-2" type="button" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="Link questions to one or multiple answers. If a question is followed by a freeanswer, it should be the only anwer of that question" data-original-title="" title=""> ?
                  </button> */}
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
                  }}>New Flow</button>
                  <button className={`btn btn-secondary mr-2 word-break-break-all`} onClick={e => {
                    setnodevisibility(!nodevisibility)
                  }}>{!nodevisibility ? `Configure current flow ` : `Hide`} </button>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-2">
                <label htmlFor="addquestion">Add Question</label>
                <textarea rows={1} disabled={disabled === "question"} className="form-control" name="question" value={form['question']}
                  onChange={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }} data-type="question" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestion" required />
              </div>
              <div className="col-md-6 col-lg-2">
                <label htmlFor="addquestiontranslation">AF Questiontranslation</label>
                <textarea rows={1} disabled={disabled === "question"} className="form-control" name="questiontranslation" value={form['questiontranslation']}
                  onChange={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }} data-type="questiontranslation" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestiontranslation" required />
              </div>
              <div className="col-md-6 col-lg-2">
                <div className=''>
                  <div className="flex-grow-1">
                    <label htmlFor="addquestionidentifier">Questionidentifier</label>
                    <input disabled={disabled === "question"} className="form-control" name="questionidentifier" type="text" value={form['questionidentifier']}
                      onChange={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, [e.target.name]: e.target.value })
                      }} data-type="questionidentifier" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addquestionidentifier" required />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 align-items-start d-flex justify-content-end">
                <div className="flex-grow-1">
                  <label htmlFor="addimage">Image</label>
                  <div className='d-flex'>
                    <input disabled={disabled === "question"} className="form-control" name="image" type="file"
                      onChange={async (e) => {
                        e.stopPropagation();
                        const imageElement = e.target
                        const img = await file2Base64(imageElement.files[0])
                        const compressed = await resizeImage(img)
                        setForm({ ...form, [imageElement.name]: compressed })
                      }} data-type="image" data-color={questioncolor} style={{ borderColor: questioncolor, borderStyle: "solid" }} id="addimage" />
                    <StyledImage className="" src={form['image']} />
                  </div>
                  <input id="addimageselector" className="form-control d-none" type='text' value={form['image']} />
                </div>
                <button className="btn btn-primary ml-1 align-self-center" type="submit">{button}</button>
              </div>
            </div>
          </form>

          <form className="" onSubmit={addAnswer}>
            <div className=" row">
              <div className="col-md-6 col-lg-2">
                <label htmlFor="addanswer">Add Answer</label>
                <textarea rows={1} disabled={disabled === "answer" || form['condition']} className="form-control w-99" name="answer" value={form['answer']}
                  onChange={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }} data-type="answer" data-color="rgb(256, 204, 1)" style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="addanswer" />
              </div>
              <div className="col-md-6 col-lg-2">
                <div>
                  <label htmlFor="answertranslation">Answertranslation</label>
                  <textarea rows={1} disabled={disabled === "answer" || form['condition']} className="form-control w-99" name="answertranslation" value={form['answertranslation']}
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }} data-type="answertranslation" data-color={questioncolor} style={{ borderColor: "rgb(256, 204, 1)", borderStyle: "solid" }} id="answertranslation" required />
                </div>
              </div>
              <div className="col-md-6 col-lg-2">
                <div className='flex-grow-1'>
                  <div>
                    <label htmlFor="answeridentifier">Answeridentifier</label>
                    <input disabled={disabled === "answer"} className="form-control " name="answeridentifier" type="text" value={form['answeridentifier']}
                      onChange={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, [e.target.name]: e.target.value })
                      }} data-type="answeridentifier" data-color={questioncolor} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="answeridentifier" required />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 d-flex">
                <div>
                  <label htmlFor="points">Points</label>
                  <input disabled={disabled === "answer"} className="form-control " name="points" type="number" value={form['points']}
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: Number(e.target.value) })
                    }} data-type="points" data-color={questioncolor} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="points" required />
                </div>
                <div className="">
                  <label htmlFor="type">Type</label>
                  <select
                    disabled={disabled === "answer" || form['freeanswer'] !== true}
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
                <div className="btn-group w-100 align-items-center" role="group" aria-label="Basic example">

                  <input
                    checked={form['pointanswer']}
                    name='pointanswer'
                    type="checkbox" className="btn-check"
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.checked, freeanswer: false, dropdown: false })
                    }}
                    style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }}
                    id="pointanswer" />
                  <label className="btn btn-primary" htmlFor="pointanswer">Point A</label>
                  <input
                    checked={form['freeanswer']}
                    name='freeanswer'
                    type="checkbox" className="btn-check"
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.checked, pointanswer: false, dropdown: false })
                    }}
                    style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }}
                    id="freeanswer" />
                  <label className="btn btn-primary" htmlFor="freeanswer">Free A</label>
                  {/* <a title="If checked you can split by a ':' between the fieldlabel and the placeholder. Eg: fieldlabel:placeholder or Phone:+490987654321" className="btn btn-secondary badge ml-2" type="button"> ? </a> */}
                  <input
                    checked={form['dropdown']}
                    name='dropdown'
                    type="checkbox" className="btn-check"
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.checked, freeanswer: false })
                    }} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="dropdown" />
                  <label className="btn btn-primary" htmlFor="dropdown">Dropdown</label>
                  <input
                    checked={form['condition']}
                    name='condition'
                    type="checkbox" className="btn-check"
                    onChange={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, [e.target.name]: e.target.checked, freeanswer: false, dropdown: false, pointanswer: false })
                    }} style={{ borderColor: "rgb(255, 204, 1)", borderStyle: "solid" }} id="condition" />
                  <label className="btn btn-primary" htmlFor="condition">Condition</label>
                  <button className="btn btn-primary ml-1" type="submit">{button}</button>
                </div>
              </div>
            </div>
            <div className="d-flex w-100 mt-2">
              <div className="form-group form-check d-flex align-items-center mr-3 mb-3">
              </div>
            </div>
          </form>

        </div >
        {
          error && error.length > 0 && (
            <div className=" m-0 mr-3 alert alert-danger">
              {error.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )
        }
      </div >
      <CanvasWrapper >
        <CanvasWidget engine={engine} />
        {/* <Loader loading={loading} >
          <div></div>
        </Loader> */}
      </CanvasWrapper>
    </div>
  );
}

export default FlowBuilder;
