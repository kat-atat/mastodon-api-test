
  class Card {
    constructor(data) {
      this.created_at = data.created_at;
      // sample: '2017-04-15T13:47:21.336Z'

      this.application = data.application;
      // sample: { name: 'Amaroq', website: 'https://appsto.re/us/OfFxib.i' }
      if (this.application === null) {
        // empty_application
        this.application = {
          name: "web",
          website: ""
        };
      }

      /**
       * .account
       */
      this.display_name = data.account.display_name;
      this.username = data.account.username;
      this.locked = data.account.locked;

      /**
       * generic
       */
      // username と acct の示す値が同一の場合、ローカルアカウントと判定します。
      this.isLocal = data.account.username === data.account.acct;

      // htmlタグを排除したテキストデータを保持します。
      this.textContent = data.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
      if (this.textContent === "") {
        // empty_textContent
        this.textContent = "**このパオはパオパオされました**";
      }
    }

    getConcatenated() {
      return `**
*   ${this.display_name}(@${this.username}) posted by: ${this.application.name}
*  --------------------
*  ${this.textContent}
**`;
    }
  }



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
  let since_id = 0;
  let limit = 50;
  let updateLocalParams = ()=> {
    libodon.timeline("public", {since_id: since_id, limit: limit, local: true})
    .then((params)=> {
      localParams.textContent =
      params.map((data)=> new Card(data))
      .filter((card)=> card.isLocal)
      .map((card)=> card.getConcatenated());
    });
  }

  localUpdate.addEventListener("click", ()=> updateLocalParams());
}
