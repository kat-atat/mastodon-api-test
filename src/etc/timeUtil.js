import getRelativeTime from "./getRelativeTime.js";

const timeUtil = {
  getRelativeTime(UTCString) {
    return getRelativeTime(Date.now(), UTCString);
  },
};

export default timeUtil;