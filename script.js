/* =========================================================
   Okay MUSIC 共通プレーヤー
   ========================================================= */

/* =========================================================
   共通下部UI
   プレーヤー＋4つのナビを全ページに自動生成
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    /* 共通プレーヤーを作成 */
    if (!document.querySelector(".player-box")) {

      const playerHTML = `

        <div class="player-box">

          <div class="player-main">

            <div class="now-playing-title">
              <span>🎧</span>
              <span id="now-title">曲を選択してください</span>
            </div>

            <div class="controls">

              <button
                type="button"
                onclick="prevSong()">
                ⏮
              </button>

              <button
                type="button"
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


    /* 共通4ボタンを作成 */
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

  }
);

/* =========================================================
   共通プレーヤーHTMLを全ページに自動生成
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    /* すでに存在する場合は作らない */
    if (document.querySelector(".player-box")) {
      return;
    }

    const playerHTML = `

      <div class="player-box">

        <div class="player-main">

          <div class="now-playing-title">
            <span>🎧</span>
            <span id="now-title">曲を選択してください</span>
          </div>

          <div class="controls">

            <button
              type="button"
              onclick="prevSong()">
              ⏮
            </button>

            <button
              type="button"
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
);

/* =========================================================
   曲リスト
   ========================================================= */

const songs = [

  {
    title: "01. 希望",
    file: "https://drive.google.com/uc?export=download&id=1BjEcPIQ6HY4RalFghko_LCMeo68OAymC"
  },

  {
    title: "02. 涙の正体",
    file: "https://drive.google.com/uc?export=download&id=1A-fMOZwDIjimq9_1wtDcva01PP89Q5K_"
  },

  {
    title: "03. 燦然",
    file: "https://drive.google.com/uc?export=download&id=1P8U6v2VbRXnWN_gAtI184XKqin17ZFEO"
  },

  {
    title: "04. クライマックス",
    file: "https://drive.google.com/uc?export=download&id=1QR4UyGPBFUPZ8tLIotS3jJHec9HtfLhS"
  },

  {
    title: "05. 主人公",
    file: "https://drive.google.com/uc?export=download&id=1ZiN69MW4PpgWtd1H5TmtkkRi6W3DyZC6"
  },

  {
    title: "06. アプローズ",
    file: "https://drive.google.com/uc?export=download&id=1ZWB1Tqe6EetA9boMR6fI_6Yn3dTfxzHT"
  },

  {
    title: "07. 健気",
    file: "https://drive.google.com/uc?export=download&id=1qYbYFDGFQAA3_N81RN0XHDHIG_vBpgYQ"
  },

  {
    title: "08. まなざし",
    file: "https://drive.google.com/uc?export=download&id=1OGSuPbky4Sl4drlgj9pQlcQJGpmN4lZ_"
  },

  {
    title: "09. 夏と跡形",
    file: "https://drive.google.com/uc?export=download&id=14JikTpXZqqChkOzDWn0g4Pnmog98WyyX"
  },

  {
    title: "10. 片想い",
    file: "https://drive.google.com/uc?export=download&id=1QHcp1rU6NfftIR1Tetjt-AyY5busWHcg"
  },

  {
    title: "11. 生きがい",
    file: "https://drive.google.com/uc?export=download&id=1ICmUePAhjxL4AVzHgqqyoGs0S1ojl_9z"
  },

  {
    title: "12. 告白",
    file: "https://drive.google.com/uc?export=download&id=19UQgaGYvx3wi1uCvrdwwwBUfpIAktvro"
  }

];


/* =========================================================
   プレーヤー本体
   ========================================================= */

const player = new Audio();

let currentSong = 0;


/* =========================================================
   曲を再生
   ========================================================= */

function playSong(number) {

  if (!songs[number]) {
    return;
  }


  currentSong = number;


  /* 再生中表示を一旦すべて解除 */

  document
    .querySelectorAll(".song")
    .forEach(function(song) {

      song.classList.remove("playing");

    });


  /* 今の曲を表示 */

  const songElement =
    document.getElementById("song" + number);


  if (songElement) {

    songElement.classList.add("playing");

  }


  /* Now Playing */

  const nowTitle =
    document.getElementById("now-title");


  if (nowTitle) {

    nowTitle.textContent =
      songs[number].title;

  }


  /* 曲を変更 */

  player.src =
    songs[number].file;


  /* 再生位置を先頭へ */

  player.currentTime = 0;


  /* 再生 */

  player.play()
    .catch(function(error) {

      console.log("再生できませんでした:", error);

    });

}


/* =========================================================
   曲が終わったら次の曲
   ========================================================= */

player.addEventListener(
  "ended",
  function() {

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

  if (currentSong < songs.length - 1) {

    playSong(currentSong + 1);

  }

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {

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
   再生位置バー
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const seekBar =
      document.getElementById("seek-bar");


    if (!seekBar) {
      return;
    }


    /* 曲の長さを取得 */

    player.addEventListener(
      "loadedmetadata",
      function() {

        seekBar.max =
          player.duration;

        seekBar.value = 0;

      }
    );


    /* 再生位置に合わせてバーを動かす */

    player.addEventListener(
      "timeupdate",
      function() {

        seekBar.value =
          player.currentTime;

      }
    );


    /* バーを動かして再生位置を変更 */

    seekBar.addEventListener(
      "input",
      function() {

        player.currentTime =
          Number(seekBar.value);

      }
    );

  }
);


/* =========================================================
   Okay MUSIC 共通ページ機能
   ========================================================= */


/* =========================================================
   ページ表示
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    document.body.classList.add(
      "page-enter"
    );

   const fixedUI =
  document.querySelectorAll(
    ".page-tools, .player-box, .nav"
  );

fixedUI.forEach(function(ui) {

  ui.style.animation = "none";

});

    /* =====================================================
       ページ遷移用の暗幕
       ===================================================== */

    const transition =
      document.createElement("div");

    transition.id =
      "page-transition";

    document.body.appendChild(
      transition
    );


    /* =====================================================
       ページ内リンク
       ===================================================== */

    document
      .querySelectorAll("a")
      .forEach(
        function(link) {

          link.addEventListener(
            "click",
            function(event) {

              const href =
                link.getAttribute("href");


              /* 対象外 */

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


              /* 同じページ */

              if (

                href ===
                window.location.pathname
                  .split("/")
                  .pop()

              ) {

                return;

              }


              /* 通常の遷移を一旦止める */

              event.preventDefault();


              /* 暗転 */

              transition.classList.add(
                "active"
              );


              /* 少し待って移動 */

              setTimeout(
                function() {

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
