/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */


/* =========================================================
   共通UIを自動生成
   戻る・更新・プレーヤー・下部ナビ
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {


  /* =========================
     左上：戻る・更新
     ========================= */

  if (!document.querySelector(".page-tools")) {

    const toolsHTML = `

      <div class="page-tools">

        <button
          class="page-tool"
          type="button"
          onclick="history.back()"
          aria-label="1つ戻る">
          ←
        </button>

        <button
          class="page-tool"
          type="button"
          onclick="location.reload()"
          aria-label="最新の情報に更新">
          ↻
        </button>

      </div>

    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      toolsHTML
    );

  }


  /* =========================
     下部4ボタン
     ========================= */

  if (!document.querySelector(".nav")) {

    const navHTML = `

      <div class="nav">

        <a href="index.html" class="nav-btn">
          <i class="fa-solid fa-house"></i>
          <span>HOME</span>
        </a>

        <a href="new.html" class="nav-btn">
          <i class="fa-solid fa-sparkles"></i>
          <span>NEW</span>
        </a>

        <a href="radio.html" class="nav-btn">
          <i class="fa-solid fa-radio"></i>
          <span>RADIO</span>
        </a>

        <a href="search.html" class="nav-btn">
          <i class="fa-solid fa-magnifying-glass"></i>
          <span>SEARCH</span>
        </a>

      </div>

    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      navHTML
    );

  }


  /* =========================
     共通プレーヤー
     ========================= */

  if (!document.querySelector(".player-box")) {

    const playerHTML = `

      <div class="player-box">

        <div class="player-main">

          <div class="now-playing-title">

            <span>🎧</span>

            <span id="now-title">
              曲を選択してください
            </span>

          </div>


          <div class="controls">

            <button
              type="button"
              onclick="prevSong()">
              ⏮
            </button>

            <button
              type="button"
              id="play-button"
              onclick="togglePlay()">
              ▶
            </button>

            <button
              type="button"
              onclick="nextSong()">
              ⏭
            </button>

          </div>

        </div>


        <input
          type="range"
          id="seek-bar"
          min="0"
          max="100"
          value="0"
          step="0.1"
        >

      </div>

    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      playerHTML
    );

  }

});


/* =========================================================
   共通プレーヤー本体
   ========================================================= */

const player = new Audio();

let currentSong = 0;


/* =========================================================
   このページの曲リストを取得
   各アルバムページで albumSongs を設定する
   ========================================================= */

function getSongs() {

  if (typeof window.albumSongs === "undefined") {
    return [];
  }

  return window.albumSongs;

}


/* =========================================================
   曲を再生
   ========================================================= */

function playSong(number) {

  const songs = getSongs();


  if (!songs[number]) {
    console.log("曲が登録されていません");
    return;
  }


  currentSong = number;


  /* 再生中表示を解除 */

  document
    .querySelectorAll(".song")
    .forEach(function (song) {

      song.classList.remove("playing");

    });


  /* 現在の曲を再生中表示 */

  const songElement =
    document.getElementById("song" + number);


  if (songElement) {

    songElement.classList.add("playing");

  }


  /* 曲名表示 */

  const nowTitle =
    document.getElementById("now-title");


  if (nowTitle) {

    nowTitle.textContent =
      songs[number].title;

  }


  /* 音源設定 */

  player.src =
    songs[number].file;


  player.currentTime = 0;


  /* 再生 */

  player.play()
    .catch(function (error) {

      console.log(
        "再生できませんでした:",
        error
      );

    });

}


/* =========================================================
   曲終了 → 次の曲
   ========================================================= */

player.addEventListener(
  "ended",
  function () {

    const songs = getSongs();

    if (currentSong < songs.length - 1) {

      playSong(currentSong + 1);

    }

  }
);


/* =========================================================
   前の曲
   ========================================================= */

function prevSong() {

  if (currentSong > 0) {

    playSong(currentSong - 1);

  }

}


/* =========================================================
   次の曲
   ========================================================= */

function nextSong() {

  const songs = getSongs();

  if (currentSong < songs.length - 1) {

    playSong(currentSong + 1);

  }

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {

  const songs = getSongs();

  if (songs.length === 0) {
    return;
  }


  if (!player.src) {

    playSong(currentSong);

    return;

  }


  if (player.paused) {

    player.play();

  } else {

    player.pause();

  }

}


/* =========================================================
   再生ボタン表示
   ========================================================= */

player.addEventListener(
  "play",
  function () {

    const button =
      document.getElementById("play-button");

    if (button) {

      button.textContent = "⏸";

    }

  }
);


player.addEventListener(
  "pause",
  function () {

    const button =
      document.getElementById("play-button");

    if (button) {

      button.textContent = "▶";

    }

  }
);


/* =========================================================
   再生位置バー
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const seekBar =
      document.getElementById("seek-bar");


    if (!seekBar) {
      return;
    }


    player.addEventListener(
      "loadedmetadata",
      function () {

        if (
          Number.isFinite(player.duration)
        ) {

          seekBar.max =
            player.duration;

          seekBar.value = 0;

        }

      }
    );


    player.addEventListener(
      "timeupdate",
      function () {

        if (
          Number.isFinite(player.duration)
        ) {

          seekBar.value =
            player.currentTime;

        }

      }
    );


    seekBar.addEventListener(
      "input",
      function () {

        player.currentTime =
          Number(seekBar.value);

      }
    );

  }
);


/* =========================================================
   ページ遷移
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const transition =
      document.createElement("div");

    transition.id =
      "page-transition";

    document.body.appendChild(
      transition
    );


    document
      .querySelectorAll("a")
      .forEach(
        function (link) {

          link.addEventListener(
            "click",
            function (event) {

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


              event.preventDefault();


              transition.classList.add(
                "active"
              );


              setTimeout(
                function () {

                  window.location.href =
                    href;

                },
                220
              );

            }
          );

        }
      );

  }
);