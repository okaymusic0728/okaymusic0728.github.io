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
