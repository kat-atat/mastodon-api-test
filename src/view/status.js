import {h, app} from "../hyperapp.js";
import attachmentView from "./attachment.js";
import timeUtil from "../etc/timeUtil.js";

const status = ({status}, action)=>
  h("div", {
    class: "status"
    + (status.sensitive ? " status--sensitive" : "")
    + (status.showSensitive ? " status--show-sensitive" : "")
    + (status.showAbsoluteTime ? " status--show-absolute-time" : ""),
  }, [
    h("div", {class: "status__account account"}, [
      h("span", {class: "account__avatar"}, h("img", {src: status.account.avatar})),
      h("span", {class: "account__display-name"}, status.account.display_name),
      h("span", {class: "account__username"}, status.account.username),
      h("span", {class: "account__acct"}, status.account.acct),
    ]),
    h("div", {
      class: "status__spoiler-text",
      onclick: ()=> action.onStatusSpoilerTextClick(status),
    }, status.spoiler_text),
    h("div", {class: "status__content", innerHTML: status.content}),
    h("div", {class: "status__media-attachments"},
      status.media_attachments.map((attachment)=>
        attachmentView({attachment}, action)
      ),
    ),
    h("span", {class: "status__replies-count", "data-replies-count": status.replies_count}),
    h("span", {class: "status__reblogs-count", "data-reblogs-count": status.reblogs_count}),
    h("span", {class: "status__favourites-count", "data-favourites-count": status.favourites_count}),
    h("div", {
      class: "status__created-at",
      "data-relative-time": timeUtil.getRelativeTime(status.created_at),
      "data-absolute-time": status.created_at,
    }),

    h("button", {
      class: "status__show-sensitive-toggle",
      onclick: ()=> action.onStatusShowSensitiveToggleClick(status),
    }),
  ])

export default status;