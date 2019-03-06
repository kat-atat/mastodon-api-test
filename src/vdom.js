import {h, app} from "./hyperapp.js";

const state = {
  statusText: "",
  instances: [],
  selectedInstanceIndex: 0,
  KEYCODE_ENTER: 13,
};

const action = {
  onkeydown: ({keyCode})=> (state)=> {
    switch (keyCode) {
      case state.KEYCODE_ENTER: return action.register(state);
    }
  },
  onclick: ()=> (state)=> action.register(state),

  register: (state)=> {
    return {};
  },

  set: (newState)=> (state)=> ({state, ...newState}),
};

const statusText = (state, action)=>
  h("div", {class: "statusText"}, [
    h("p", {}, state.statusText),
  ])

const register = (state, action)=> 
  h("div", {class: "register"}, [
    h("label", {}, [
      h("span", {}, "https://"),
      h("input", {
        type: "text",
        placeholder: "mastodon.example.com",
        onkeydown: (ev)=> action.onkeydown(ev),
      }),
    ]),
    h("button", {onclick: ()=> action.onclick()}, "CONNECT"),
  ])

const selector = (state, action)=>
  h("div", {class: "selector"}, [
    h("select", {disabled: state.instances.length === 0}, [
      ...state.instances.map(({url, username}, index)=>
        h("option", {value: "", selected: index === state.selectedInstanceIndex}, `${username}@${url}`)
      ),
    ]),
  ])

const view = (state, action)=>
  h("div", {}, [
    statusText,
    register,
    selector,
  ])

export default (node)=> app(state, action, view, node);
