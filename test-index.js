{
  let appName = "testapp";
  let appURL = location.origin + location.pathname;

  let libodon = new Libodon(appName, appURL);

  let select = document.querySelector("select");
  let prefix = "libodon_registration_";
  let registeredList = Object.keys(localStorage).filter((string)=> new RegExp(prefix).exec(string))
  registeredList.forEach((string, index)=> {
    let option = document.createElement("option");
    option.value =
    option.textContent = string.slice(prefix.length);
    select.appendChild(option)
  })
  let input = document.querySelector("input");
  select.addEventListener("change", ()=> input.value = select.value)
  let submit = document.querySelector("button");
  let dialog = document.querySelector(".dialog");

  let timeline = document.querySelector(".Timeline");
  timeline.classList.add("hidden");
  let local = timeline.querySelector(".Timeline--Local");
  let localUpdate = local.querySelector("button");
  let localParams = local.querySelector(".Timeline--Local--params");

  let tryToConnect = ()=> {
    let instance_url = input.value;

    let connect = libodon.connect(instance_url);

    connect.then((conn)=> {
      timeline.classList.add("hidden");
      dialog.classList.add("loading");
      dialog.textContent = "インスタンスの応答を待っています。";

      if (conn.result === "redirect") {
        location.href = conn.target;
      }
      else if (conn.result === "success") {
        timeline.classList.remove("hidden");
        dialog.classList.remove("loading");
        dialog.textContent = "トークンの取得に成功しました。💪";
        console.log(libodon);
        updateLocalParams();
      }
    })
    .catch((error)=> {
      dialog.classList.remove("loading");
      dialog.textContent = "トークンの取得に失敗しました。👾";
      console.log(error)
    });
  }

  submit.addEventListener("click", ()=> tryToConnect());
  input.addEventListener("keydown", (event)=> {
    if (event.keyCode === 13) {
      tryToConnect();
    }
  });
  let updateLocalParams = ()=> {
    libodon.streaming("public", {local: true})
    .then((websocket)=> {

      websocket.addEventListener("message", (event)=> {
        let json = JSON.parse(event.data);
        let toot = JSON.parse(json.payload);

        let account = toot.account;
        let display_name = account.display_name||"";
        let user_name = account.user_name||"";
        let application = toot.application||{name: "web"}
        let content = toot.content||"";
        content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

        let card = `**
  *   ${display_name}(@${user_name}) posted by: ${application.name}
  *  --------------------
  *  ${content}
  **`;
        localParams.textContent = card + "\n" + localParams.textContent;

      });
    });
  }

  localUpdate.addEventListener("click", ()=> updateLocalParams());
}
