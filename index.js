


{
  let appName = "testapp";
  let appURL = "http://abandon-testapp.herokuapp.com";

  let libodon = new Libodon(appName, appURL);

  let input = document.querySelector("input");
  let submit = document.querySelector("button");
  let dialog = document.querySelector(".dialog");

  let whenAPIUsable = new Promise((resolve, reject)=> {

    submit.addEventListener("click", ()=> {
      if (input.value === "") {
        return;
      }

      let instance_url = "https://" + input.value;
      let user_email = "";

      libodon.connect(instance_url, user_email)
      .then((conn)=> {
        if (conn.result === "redirect") {
          window.location = conn.target;
          dialog.textContent = "インスタンスの応答を待っています。";
        }
        else if (conn.result === "success") {
          resolve();
        }
      }).catch((error)=> {
        reject(error);
      });

    });
  });

  whenAPIUsable.then(()=> {
    dialog.textContent = "トークンの取得に成功しました。💪";
  })
  .catch(()=> {
    dialog.textContent = "トークンの取得に失敗しました。👾";
  });
}





