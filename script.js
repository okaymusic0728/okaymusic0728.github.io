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


/* =========================================================
   プレーヤーを取得
   ※ HTMLにaudio要素がなくても自動作成
   ========================================================= */

function getPlayer() {

  let player = document.getElementById("player");

  if (!player) {

    player = document.createElement("audio");

    player.id = "player";

    player.preload = "metadata";

    document.body.appendChild(player);

  }

  return player;

}


/* =========================================================
   曲を再生
   ========================================================= */

function playSong(number) {

  const player = getPlayer();

  if (!songs[number]) {
    return;
  }

  currentSong = number;


  /* 全曲の再生中表示を解除 */

  document
    .querySelectorAll(".song")
    .forEach(function(song) {

      song.classList.remove("playing");

    });


  /* 現在の曲を再生中表示 */

  const songElement =
    document.getElementById("song" + number);

  if (songElement) {

    songElement.classList.add("playing");

  }


  /* プレーヤーの曲名 */

  const nowTitle =
    document.getElementById("now-title");

  if (nowTitle) {

    nowTitle.textContent =
      songs[number].title;

  }


  /* 曲を変更 */

  player.src =
    songs[number].file;

  player.load();


  /* 再生 */

  player.play().catch(function() {});

}


/* =========================================================
   前の曲
   ========================================================= */

function prevSong() {

  if (currentSong > 0) {

    playSong(currentSong - 1);

  }

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {

  const player = getPlayer();

  if (player.paused) {

    player.play().catch(function() {});

  } else {

    player.pause();

  }

}


/* =========================================================
   次の曲
   ========================================================= */

function nextSong() {

  if (
    currentSong <
    songs.length - 1
  ) {

    playSong(currentSong + 1);

  }

}


/* =========================================================
   初期化
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const player = getPlayer();

    const seekBar =
      document.getElementById("seek-bar");


    /* =====================================================
       曲終了 → 次の曲
       ===================================================== */

    player.addEventListener(
      "ended",
      function() {

        if (
          currentSong <
          songs.length - 1
        ) {

          playSong(currentSong + 1);

        }

      }
    );


    /* =====================================================
       再生位置バー
       ===================================================== */

    if (seekBar) {

      player.addEventListener(
        "loadedmetadata",
        function() {

          seekBar.max =
            player.duration || 0;

          seekBar.value = 0;

        }
      );


      player.addEventListener(
        "timeupdate",
        function() {

          if (!isNaN(player.duration)) {

            seekBar.value =
              player.currentTime;

          }

        }
      );


      seekBar.addEventListener(
        "input",
        function() {

          player.currentTime =
            Number(seekBar.value);

        }
      );

    }


    /* =====================================================
       ページ遷移アニメーション
       ===================================================== */

    document.body.classList.add(
      "page-enter"
    );


    const transition =
      document.createElement("div");

    transition.id =
      "page-transition";

    document.body.appendChild(
      transition
    );


    document
      .querySelectorAll("a")
      .forEach(function(link) {

        link.addEventListener(
          "click",
          function(event) {

            const href =
              link.getAttribute("href");


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


            if (
              href ===
              window.location.pathname
                .split("/")
                .pop()
            ) {

              return;

            }


            event.preventDefault();


            transition.classList.add(
              "active"
            );


            setTimeout(
              function() {

                window.location.href =
                  href;

              },
              220
            );

          }

        );

      });

  }
);
