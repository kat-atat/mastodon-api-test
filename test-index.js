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
  let localParams = local.querySelector(".Timeline--Local--params");
  let timelineNotification = timeline.querySelector(".Timeline--Notification");

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

      let paramsStack = [];
      let paramsLlimit = 50;
      let notificationStack = [];
      let notificationLlimit = 50;
      websocket.addEventListener("message", (event)=> {
        let json = JSON.parse(event.data);
        let eventType = json.event;

        let pushStatus = (status)=> {
          let account = status.account;
          let display_name = account.display_name;
          let username = account.username;
          let application = status.application||{name: "web"}
          let content = status.content;
          content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

          let card = `**
    *   ${display_name}(@${username}) posted by: ${application.name}
    *  --------------------
    *  ${content}
    **`;
          if (paramsStack.push(card) > paramsLlimit) {
            paramsStack.shift();
          }
          paramsStack.reverse();
          localParams.textContent = paramsStack.join("\n");
          paramsStack.reverse();
        }

        let pushNotification = (status)=> {
          let account = status.account;
          let display_name = account.display_name;
          let username = account.username;
          let application = status.application||{name: "web"}
          let content = status.content;
          content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

          let card = `**
    *   ${display_name}(@${username}) posted by: ${application.name}
    *  --------------------
    *  ${content}
    **`;
          if (notificationStack.push(card) > notificationLlimit) {
            notificationStack.shift();
          }
          notificationStack.reverse();
          localParams.textContent = notificationStack.join("\n");
          notificationStack.reverse();
        }

        if (eventType === "update") {
          let status = JSON.parse(json.payload);
          pushStatus(status);
        }

        else if (eventType === "delete") {
          let id = JSON.parse(json.payload);
          paramsStack.filter((status)=> status.id === id)
          .forEach((status)=> pushNotification(status));
        }
      });
    });
  }

}
