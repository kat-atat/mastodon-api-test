import {h, app} from "../hyperapp.js";

const router = {
  onkeydown: (ev, onconnect)=>
    ev.keyCode === 13
      ? onconnect()
      : null,
}

const connect = ({accounts, selectedIndex}, {onconnect, onaccountchange})=> 
  h("div", {class: "connect"}, [
    h("label", {}, h("input", {
      type: "text",
      placeholder: "example.com",
      onkeydown: (ev)=> router.onkeydown(ev, onconnect),
    })),
    h("label", {}, h("input", {type: "button", onclick: ()=> onconnect()})),
    h("select", {onchange: ()=> onaccountchange(), disabled: accounts.length === 0},
      accounts.map((account, index)=>
        h("option", {selected: index === selectedIndex}, `{username}@{url}`)
      ),
    ),
  ])

export default connect;