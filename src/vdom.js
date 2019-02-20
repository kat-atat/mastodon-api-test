import {h, app} from "./hyperapp.js";

const state = {
  count: 0,
  instances: [
    {url: "hogehoge.mastodon.com", username: "hogemaru", selected: false},
    {url: "huga.tootsuite.com", username: "hugapoyo", selected: true},
  ],
  dialog_text: "init",
  dialog_type: "init",
  DIALOG_TYPE_INIT: "init",
  DIALOG_TYPE_WARN: "warn",
  DIALOG_TYPE_DANGER: "danger",
  DIALOG_TEXT_INIT: "ready.",
  DIALOG_TEXT_SUCCESED: "トークンの取得に成功しました。💪",
  DIALOG_TEXT_FAILED: "トークンの取得に失敗しました。👾",
  columnIndex: 0,
};

const action = {
  ondown: (value)=> (state)=> ({count: state.count + value}),
  onup: (value)=> (state)=> ({count: state.count - value}),
  onupdate: ()=> (state)=> {
    switch (state.count) {
      case 1: return {dialog_text: state.DIALOG_TEXT_SUCCESED, dialog_type: state.DIALOG_TYPE_INIT};
      case 2: return {dialog_text: state.DIALOG_TEXT_FAILED, dialog_type: state.DIALOG_TYPE_WARN};
      default: return {dialog_text: state.DIALOG_TEXT_INIT, dialog_type: state.DIALOG_TYPE_INIT};
    }
  },
  oncolumnchange: (value)=> (state)=> ({colmnIndex: value}),
};

const dialog = ({dialog_text, dialog_type})=>
  h("div", {class: "Dialog"}, [
    ()=> {switch (dialog_type) {
      case "warn": return h("p", {style: "color: orange"}, dialog_text)
      case "danger": return h("p", {style: "color: red"}, dialog_text)
      default: return h("p", {}, dialog_text)
    }},
  ])

const register = (state, action)=> 
  h("div", {class: "Register"}, [
    h("input", {type: "text", placeholder: "mastodon.example.com"}),
    h("button", {}, "CONNECT"),
  ])

const selector = ({instances})=>
  h("div", {class: "Selector"}, [
    h("select", {disabled: instances.length === 0}, [
      ...instances.map(({url, username, selected})=>
        h("option", {value: "", selected: selected}, `${username}@${url}`)),
    ]),
  ])

const timeline = ()=>
  h("div", {}, [
    h("div", {}, "this is toot"),
    h("div", {}, "this is toot"),
    h("div", {}, "this is toot"),
  ])

const counter = ({count, ondown, onup, onupdate})=> 
  h("div", {onupdate: ()=> onupdate()}, [
    h("h1", {}, count),
    h("button", {onclick: ()=> ondown(1)}, "-"),
    h("button", {onclick: ()=> onup(1)}, "+"),
  ])


const view = (state, action)=>
  h("div", {}, [
    h(dialog, state),
    h(register, state),
    h(selector, state),
    h(timeline, state),
    h(counter, {...state, ...action}),
  ])

export default (node)=> app(state, action, view, node);
