const songs = [

  {
    title: "01. 希望",
    file: "01.mp3"
  },

  {
    title: "02. 涙の正体",
    file: "02.mp3"
  },

  {
    title: "03. 燦然",
    file: "03.mp3"
  },

  {
    title: "04. クライマックス",
    file: "04.mp3"
  },

  {
    title: "05. 主人公",
    file: "05.mp3"
  },

  {
    title: "06. アプローズ",
    file: "06.mp3"
  },

  {
    title: "07. 健気",
    file: "07.mp3"
  },

  {
    title: "08. まなざし",
    file: "08.mp3"
  },

  {
    title: "09. 夏と跡形",
    file: "09.mp3"
  },

  {
    title: "10. 片想い",
    file: "10.mp3"
  },

  {
    title: "11. 生きがい",
    file: "11.mp3"
  },

  {
    title: "12. 告白",
    file: "12.mp3"
  }

];


let currentSong = 0;


function playSong(number) {

  const player = document.getElementById("player");

  currentSong = number;

  // 前に光っていた曲を消す
  document.querySelectorAll(".song").forEach(function(song){
    song.classList.remove("playing");
  });

  // 今の曲を光らせる

const songElement =
document.getElementById("song" + number);


if(songElement){

  songElement.classList.add("playing");

}
  // 曲名表示
  document.getElementById("now-title").innerHTML =
    songs[number].title;

  // 再生
  player.src = songs[number].file;

  player.play();

}


document
.getElementById("player")
.addEventListener(
"ended",
function(){

  if(currentSong < songs.length - 1){

    playSong(currentSong + 1);

  }

});
// 前の曲

function prevSong(){

  if(currentSong > 0){

    playSong(currentSong - 1);

  }

}


// 再生・一時停止

function togglePlay(){

  const player = document.getElementById("player");


  if(player.paused){

    player.play();

  }else{

    player.pause();

  }

}


// 次の曲

function nextSong(){

  if(currentSong < songs.length - 1){

    playSong(currentSong + 1);

  }

}

/* =========================================
   Okay Music 共通ページ機能
   ・ページ遷移アニメーション
   ・左上の戻るボタン
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {


  /* =======================================
     ページ表示時
     ======================================= */

  document.body.classList.add("page-enter");


  /* =======================================
     ページ遷移用の暗幕を作る
     ======================================= */

  const transition =
    document.createElement("div");

  transition.id = "page-transition";

  document.body.appendChild(transition);


  /* =======================================
     左上の戻るボタンを作る
     ======================================= */

  const backButton =
    document.createElement("a");

  backButton.id = "okay-back-button";

  backButton.href = "#";

  backButton.innerHTML = "←";

  backButton.setAttribute(
    "aria-label",
    "前のページへ戻る"
  );

  document.body.appendChild(backButton);


  /* =======================================
     戻るボタン
     ======================================= */

  backButton.addEventListener(
    "click",
    function (event) {

      event.preventDefault();


      /* 履歴がある場合 */

      if (window.history.length > 1) {

        transition.classList.add("active");


        setTimeout(function () {

          window.history.back();

        }, 220);


      }

      /* 履歴がない場合はHOMEへ */

      else {

        transition.classList.add("active");


        setTimeout(function () {

          window.location.href =
            "index.html";

        }, 220);

      }

    }
  );


  /* =======================================
     ページ内リンクの遷移アニメーション
     ======================================= */

  document.querySelectorAll("a").forEach(
    function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const href =
            link.getAttribute("href");


          /* 通常のページリンクだけ対象 */

          if (
            !href ||
            href === "#" ||
            href.startsWith("#") ||
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
          ) {

            return;

          }


          /* 同じページへのリンク */

          if (
            href ===
            window.location.pathname.split("/").pop()
          ) {

            return;

          }


          event.preventDefault();


          transition.classList.add("active");


          setTimeout(function () {

            window.location.href = href;

          }, 220);

        }
      );

    }
  );

});

/* =========================================
   ページ遷移アニメーション
   ========================================= */

/* ページが表示されたとき */
body {
  opacity: 1;
  transition: opacity 0.35s ease;
}


/* ページ表示開始 */
body.page-enter {
  animation: pageEnter 0.45s ease forwards;
}


@keyframes pageEnter {

  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }

}


/* =========================================
   ページ切り替え用の暗幕
   ========================================= */

#page-transition {

  position: fixed;

  inset: 0;

  background: #000;

  opacity: 0;

  pointer-events: none;

  z-index: 99999;

  transition:
    opacity 0.22s ease;

}


/* ページ移動直前 */
#page-transition.active {

  opacity: 1;

}


/* =========================================
   左上の戻るボタン
   ========================================= */

#okay-back-button {

  position: fixed;

  top: 15px;

  left: 15px;

  width: 42px;

  height: 42px;

  border-radius: 50%;

  background: rgba(20,20,20,0.65);

  color: white;

  text-decoration: none;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 22px;

  line-height: 1;

  box-shadow:
    0 4px 15px rgba(0,0,0,0.45);

  backdrop-filter: blur(6px);

  -webkit-backdrop-filter: blur(6px);

  z-index: 100000;

  transition:
    transform 0.15s ease,
    background 0.15s ease;

}


/* 押したとき */
#okay-back-button:active {

  transform: scale(0.88);

  background: rgba(255,255,255,0.25);

}