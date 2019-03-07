const storage = {
  get: (key)=> JSON.parse(localStorage.getItem(key)),
  set: (key, obj)=> localStorage.setItem(key, JSON.stringify(obj)),
  remove: (key)=> localStorage.removeItem(key),
  clear: ()=> localStorage.clear(),
}

export default storage;