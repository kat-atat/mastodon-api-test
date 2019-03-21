import {h, app} from "../hyperapp.js";
import attachment from "./attachment.js";

const status = (status)=>
  h("div", {class: "status"}, [
    h("div", {class: "status__account account"}, [
      h("span", {class: "account__avatar"}, h("img", {src: status.account.avatar})),
      h("span", {class: "account__display-name"}, status.account.display_name),
      h("span", {class: "account__acct"}, status.account.acct),
    ]),
    h("div", {class: "status__content", innerHTML: status.content}),
    h("div", {class: "status__media-attachments"},
      status.media_attachments.map((a_attachment)=>
        attachment(a_attachment)
      ),
    ),
    h("span", {class: "status__replies-count"}, status.replies_count),
    h("span", {class: "status__reblogs-count"}, status.reblogs_count),
    h("span", {class: "status__favourites-count"}, status.favourites_count),
    h("div", {class: "status__created-at"}, status.created_at),
  ])

export default status;