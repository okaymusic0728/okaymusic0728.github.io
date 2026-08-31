/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */


/* =========================================================
   共通オーディオプレーヤー
   ========================================================= */

const player = new Audio();

let currentSong = 0;


/* =========================================================
   次の曲の先読み用プレーヤー
   ========================================================= */

const nextPlayer = new Audio();

let preloadedSong = -1;


/* =========================================================
   共通UIを自動生成
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     左上：戻る・更新
     TOPページ以外に自動表示
     ========================= */

  if (
    !document.querySelector(".page-tools") &&
    !document.body.classList.contains("home-page")
  ) {

    document.body.insertAdjacentHTML(
      "afterbegin",
      `
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
      `
    );

  }


  /* =========================
     下部4ボタン
     全ページ共通
     ========================= */

  if (!document.querySelector(".nav")) {

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="nav">

        <a href="index.html" class="nav-btn">
          <i class="fa-solid fa-house"></i>
          <span>HOME</span>
        </a>

        <a href="new.html" class="nav-btn">
          <span class="nav-icon">✴︎</span>
          <span>NEWS</span>
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
      `
    );

  }


  /* =========================
     共通プレーヤー
     全ページ共通
     ========================= */

  if (!document.querySelector(".player-box")) {

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="player-box">

        <div class="player-main">

          <div class="now-playing-title">

            <span id="now-title">
              曲を選択してください
            </span>

          </div>


          <div class="controls">

            <button
              type="button"
              onclick="prevSong()"
              aria-label="前の曲">

              <i class="fa-solid fa-backward-step"></i>

            </button>


            <button
              type="button"
              class="play-button"
              onclick="togglePlay()"
              aria-label="再生・一時停止">

              <i
                id="play-icon"
                class="fa-solid fa-play">
              </i>

            </button>


            <button
              type="button"
              onclick="nextSong()"
              aria-label="次の曲">

              <i class="fa-solid fa-forward-step"></i>

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


        <div class="player-time">

          <span id="current-time">
            0:00
          </span>

          <span id="duration">
            0:00
          </span>

        </div>

      </div>
      `
    );

  }


  /* =========================
     シークバー設定
     ========================= */

  setupSeekBar();

});


/* =========================================================
   曲データ取得
   ========================================================= */

function getSongs() {

  if (Array.isArray(window.albumSongs)) {
    return window.albumSongs;
  }

  return [];

}


/* =========================================================
   次の曲を先読み
   ========================================================= */

function preloadNextSong() {

  const songs = getSongs();

  if (songs.length === 0) {
    return;
  }


  let nextSongNumber =
    currentSong + 1;


  if (nextSongNumber >= songs.length) {

    nextSongNumber = 0;

  }


  if (!songs[nextSongNumber]) {
    return;
  }


  if (preloadedSong === nextSongNumber) {
    return;
  }


  nextPlayer.src =
    songs[nextSongNumber].file;


  nextPlayer.load();


  preloadedSong =
    nextSongNumber;

}


/* =========================================================
   曲を再生
   ========================================================= */

function playSong(number) {

  const songs = getSongs();

  if (!songs[number]) {
    return;
  }


  currentSong = number;


  /* 曲一覧の再生中表示 */

  document
    .querySelectorAll(".song")
    .forEach(function (song) {

      song.classList.remove("playing");

    });


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


  /* 次の曲を先読み */

  preloadNextSong();

}


/* =========================================================
   前の曲
   ========================================================= */

function prevSong() {

  const songs = getSongs();

  if (songs.length === 0) {
    return;
  }


  if (currentSong > 0) {

    playSong(currentSong - 1);

  } else {

    playSong(songs.length - 1);

  }

}


/* =========================================================
   次の曲
   ========================================================= */

function nextSong() {

  const songs = getSongs();

  if (songs.length === 0) {
    return;
  }


  if (currentSong < songs.length - 1) {

    playSong(currentSong + 1);

  } else {

    playSong(0);

  }

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {

  const songs = getSongs();


  /* まだ曲を選択していない場合 */

  if (!player.src) {

    if (songs.length > 0) {

      playSong(currentSong);

    }

    return;

  }


  if (player.paused) {

    player.play()
      .catch(function (error) {

        console.log(
          "再生できませんでした:",
          error
        );

      });

  } else {

    player.pause();

  }

}


/* =========================================================
   曲の再生終了
   ========================================================= */

player.addEventListener(
  "ended",
  function () {

    nextSong();

  }
);


/* =========================================================
   シークバー
   ========================================================= */

function setupSeekBar() {

  const seekBar =
    document.getElementById("seek-bar");


  if (!seekBar) {
    return;
  }


  player.addEventListener(
    "loadedmetadata",
    function () {

      if (Number.isFinite(player.duration)) {

        seekBar.max =
          player.duration;


        const duration =
          document.getElementById("duration");


        if (duration) {

          duration.textContent =
            formatTime(player.duration);

        }

      }

    }
  );


  player.addEventListener(
    "timeupdate",
    function () {

      seekBar.value =
        player.currentTime;


      const currentTime =
        document.getElementById("current-time");


      if (currentTime) {

        currentTime.textContent =
          formatTime(player.currentTime);

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


/* =========================================================
   時間表示
   ========================================================= */

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }


  const minutes =
    Math.floor(seconds / 60);


  const remainingSeconds =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");


  return (
    minutes +
    ":" +
    remainingSeconds
  );

}


/* =========================================================
   再生アイコン変更
   ========================================================= */

function updatePlayIcon(isPlaying) {

  const playIcon =
    document.getElementById("play-icon");


  if (!playIcon) {
    return;
  }


  if (isPlaying) {

    playIcon.className =
      "fa-solid fa-pause";

  } else {

    playIcon.className =
      "fa-solid fa-play";

  }

}


/* =========================================================
   再生状態をボタンに反映
   ========================================================= */

player.addEventListener(
  "play",
  function () {

    updatePlayIcon(true);

  }
);


player.addEventListener(
  "pause",
  function () {

    updatePlayIcon(false);

  }
);