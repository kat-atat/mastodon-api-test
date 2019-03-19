import {h, app} from "../hyperapp.js";

const attachment = (attachment)=>
  h("div", {
    class: "attachment",
    "data-id": attachment.id,
    "data-remote-url": attachment.remote_url,
    "data-preview-url": attachment.preview_url,
    "data-text-url": attachment.text_url,
    "data-meta": attachment.meta,
    "data-description": attachment.description,
  },
    (()=> {
      switch (attachment.type) {
        case "unknown": return h("img", {src: attachment.url});
        case "image": return h("img", {src: attachment.url});
        case "gifv": return h("img", {src: attachment.url});
        case "video": return h("video", {src: attachment.url});
        default: return h("div");
      }
    })()
  );

export default attachment;