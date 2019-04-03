import {h, app} from "../hyperapp.js";
import attachmentView from "./attachment.js";
import timeUtil from "../etc/timeUtil.js";

const display_name = (status)=>
  status.account.display_name
  ? status.account.display_name // TODO: emoji process
  : status.account.username;

const acct = (status)=>
  "@" + status.account.acct; // TODO: url ellipsis process

const content = (status)=>
  status.content; // TODO: emoji process, url ellipsis process

const isPreSensitive = (status)=>
  !status.spoiler_text && status.media_attachments.length === 0 && status.sensitive;


const status = ({status}, action)=>
  h("div", {
    class: "status"
    + (status.sensitive ? " status--sensitive" : " status--no-sensitive")
    + (isPreSensitive(status) ? " status--pre-sensitive" : "")
    + (status.sensitive ? (status.showSensitive ? " status--show-sensitive" : " status--hide-sensitive") : "")
  }, [
    h("span", {class: "status__metadata status__account-avatar"}, h("img", {src: status.account.avatar})),
    h("span", {class: "status__metadata status__account-display-name", innerHTML: display_name(status)}),
    h("span", {class: "status__metadata status__account-acct"}, acct(status)),
    h("div", {class: "status__contents status__content", innerHTML: content(status)}),
    h("div", {class: "status__contents status__media-attachments"},
      status.media_attachments.map((attachment)=>
        attachmentView({attachment}, action)
      ),
    ),
    h("div", {
      class: "status__sensitives status__spoiler-text spoiler"
      + (status.showSensitive ? " spoiler--open" : " spoiler--close"),
      onclick: ()=> action.onStatusSpoilerTextClick(status),
    },
      h("span", {class: "spoiler__content"}, status.spoiler_text),
    ),
    h("span", {class: "status__metadata status__replies-count"}, [
      h("span", {class: "icon icon--reply"}),
      status.replies_count,
    ]),
    h("span", {class: "status__metadata status__reblogs-count"}, [
      h("span", {class: "icon icon--reblog"}),
      status.reblogs_count,
    ]),
    h("span", {class: "status__metadata status__favourites-count"}, [
      h("span", {class: "icon icon--favourite"}),
      status.favourites_count,
    ]),
    h("div", {class: "status__metadata status__created-at"},
      status.showAbsoluteTime ? status.created_at : timeUtil.getRelativeTime(status.created_at),
    ),

    h("span", {
      class: "status__sensitives status__show-sensitive-toggle toggle"
      + (status.showSensitive ? " toggle--checked" : " toggle--unchecked"),
      onclick: ()=> action.onStatusShowSensitiveToggleClick(status),
    },
      h("span", {class: "icon icon--show-sensitive"}),
    ),
  ])

export default status;