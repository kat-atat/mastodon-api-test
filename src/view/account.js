import {h, app} from "../hyperapp.js";

const account = (account)=>
  h("div", {class: "account"}, [
    h("div", {class: "account__header"}, h("img", {src: account.header})),
    h("div", {class: "account__avatar"}, h("img", {src: account.avatar})),
    h("span", {class: "account__display_name"}, account.display_name),
    h("span", {class: "account__acct"}, account.acct),
    h("div", {class: "account__url"}, account.url),
    h("div", {class: "account__locked"}, account.locked),
    h("div", {class: "account__bot"}, account.bot),
    h("div", {class: "account__note", innerHTML: account.note}),
    h("div", {class: "account__fields"}, account.fields),
    h("div", {class: "account__created-at"}, account.created_at),
    h("span", {class: "account__statuses-count"}, account.statuses_count),
    h("span", {class: "account__following-count"}, account.following_count),
    h("span", {class: "account__followers-count"}, account.followers_count),
  ])

export default account;