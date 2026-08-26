/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */

const player = new Audio();

let currentSong = 0;


/* =========================================================
   共通UIを自動生成
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     左上：戻る・更新
     ========================= */

  if (!document.querySelector(".page-tools")) {

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
     下部ナビ
     ========================= */

  if (!document.querySelector(".nav")) {

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="nav">

        <a href="index.html" class="nav-btn">
          <i class="fa-solid fa-house"></i>
          <span>ホーム</span>
        </a>

        <a href="new.html" class="nav-btn">
          <i class="fa-solid fa-sparkles"></i>
          <span>新着</span>
        </a>

        <a href="radio.html" class="nav-btn">
          <i class="fa-solid fa-radio"></i>
          <span>ラジオ</span>
        </a>

        <a href="search.html" class="nav-btn">
          <i class="fa-solid fa-magnifying-glass"></i>
          <span>検索</span>
        </a>

      </div>
      `
    );

  }


  /* =========================
     Apple Music風プレーヤー
     ========================= */

  if (!document.querySelector(".player-box")) {

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="player-box">

        <div class="player-info">

          <div class="now-playing-title">
            <span id="now-title">
              曲を選択してください
            </span>
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


        <div class="controls">

          <button
            type="button"
            onclick="prevSong()">
            <i class="fa-solid fa-backward-step"></i>
          </button>

          <button
            type="button"
            class="play-button"
            onclick="togglePlay()">
            <i
              id="play-icon"
              class="fa-solid fa-play">
            </i>
          </button>

          <button
            type="button"
            onclick="nextSong()">
            <i class="fa-solid fa-forward-step"></i>
          </button>

        </div>

      </div>
      `
    );

  }


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


  /* 音源変更 */

  player.src =
    songs[number].file;


  player.currentTime = 0;


  player.play()
    .then(function () {

      updatePlayIcon(true);

    })
    .catch(function (error) {

      console.log(
        "再生できませんでした:",
        error
      );

      updatePlayIcon(false);

    });

}


/* =========================================================
   前の曲
   ========================================================= */

function prevSong() {

  const songs = getSongs();


  if (currentSong > 0) {

    playSong(currentSong - 1);

  } else if (songs.length > 0) {

    playSong(songs.length - 1);

  }

}


/* =========================================================
   次の曲
   ========================================================= */

function nextSong() {

  const songs = getSongs();


  if (currentSong < songs.length - 1) {

    playSong(currentSong + 1);

  } else if (songs.length > 0) {

    playSong(0);

  }

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {

  const songs = getSongs();


  if (!player.src) {

    if (songs.length > 0) {

      playSong(currentSong);

    }

    return;

  }


  if (player.paused) {

    player.play();

    updatePlayIcon(true);

  } else {

    player.pause();

    updatePlayIcon(false);

  }

}


/* =========================================================
   再生終了
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

      if (
        Number.isFinite(player.duration)
      ) {

        seekBar.max =
          player.duration;

        document.getElementById(
          "duration"
        ).textContent =
          formatTime(player.duration);

      }

    }
  );


  player.addEventListener(
    "timeupdate",
    function () {

      seekBar.value =
        player.currentTime;


      const currentTime =
        document.getElementById(
          "current-time"
        );


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


player.addEventListener(
  "pause",
  function () {

    updatePlayIcon(false);

  }
);


player.addEventListener(
  "play",
  function () {

    updatePlayIcon(true);

  }
);