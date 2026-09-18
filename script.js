/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */


/* =========================================================
   共通オーディオプレーヤー
   ========================================================= */

const player = new Audio();

let currentSong = 0;


/* =========================================================
   共通ビデオプレーヤー
   ========================================================= */

const videoPlayer = document.createElement("video");

videoPlayer.controls = true;
videoPlayer.preload = "auto";
videoPlayer.playsInline = true;
videoPlayer.setAttribute("playsinline", "");
videoPlayer.setAttribute("webkit-playsinline", "");

videoPlayer.style.display = "block";
videoPlayer.style.width = "100%";
videoPlayer.style.maxWidth = "900px";
videoPlayer.style.maxHeight = "80vh";
videoPlayer.style.height = "auto";
videoPlayer.style.margin = "0 auto";
videoPlayer.style.background = "#000";


/* =========================================================
   次の曲の先読み
   ========================================================= */

const nextPlayer = new Audio();

let preloadedSong = -1;


/* =========================================================
   再生中のアルバム情報
   ページ移動しても保持する
   ========================================================= */

let activeSongs = [];


/* =========================================================
   自動再生監視・復旧
   ========================================================= */

let shouldBePlaying = false;

let recoveryTimer = null;

let recoveryAttempts = 0;

let recoveryInProgress = false;

let lastPlaybackTime = 0;

let lastPlaybackCheck = Date.now();

const MAX_RECOVERY_ATTEMPTS = 5;


/* =========================================================
   共通UIを自動生成
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupPageRoot();

    createPageTools();

    createNavigation();

    createPlayer();

    setupSeekBar();

    setupPageNavigation();

  }
);


/* =========================================================
   共通ページ領域
   ========================================================= */

function setupPageRoot() {

  if (
    document.getElementById("page-content-root")
  ) {

    return;

  }


  const root =
    document.createElement("div");


  root.id =
    "page-content-root";


  const children =
    Array.from(
      document.body.children
    );


  children.forEach(
    function (element) {

      if (

        element.classList.contains("page-tools") ||

        element.classList.contains("nav") ||

        element.classList.contains("player-box") ||

        element.id === "video-player-box"

      ) {

        return;

      }


      root.appendChild(element);

    }
  );


  document.body.insertBefore(
    root,
    document.body.firstChild
  );


  document
    .head
    .querySelectorAll("style")
    .forEach(
      function (style) {

        style.dataset.spaPageStyle = "true";

      }
    );

}


/* =========================================================
   戻るボタン
   ========================================================= */

function createPageTools() {

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
          onclick="goBack()"
          aria-label="1つ戻る">

          ←

        </button>

      </div>
      `
    );

  }

}


function goBack() {

  history.back();

}


/* =========================================================
   下部4ボタン
   ========================================================= */

function createNavigation() {

  if (
    document.querySelector(".nav")
  ) {

    return;

  }


  document.body.insertAdjacentHTML(
    "beforeend",

    `
    <div class="nav">

      <a
        href="index.html"
        class="nav-btn">

        <i class="fa-solid fa-house"></i>

        <span>
          HOME
        </span>

      </a>


      <a
        href="new.html"
        class="nav-btn">

        <span class="nav-icon">
          ✴︎
        </span>

        <span>
          NEWS
        </span>

      </a>


      <a
        href="javascript:void(0)"
        class="nav-btn">

        <i class="fa-solid fa-radio"></i>

        <span>
          RADIO
        </span>

      </a>


      <a
        href="search.html"
        class="nav-btn">

        <i class="fa-solid fa-magnifying-glass"></i>

        <span>
          SEARCH
        </span>

      </a>

    </div>
    `
  );

}


/* =========================================================
   共通プレーヤー
   ========================================================= */

function createPlayer() {

  if (
    document.querySelector(".player-box")
  ) {

    return;

  }


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


/* =========================================================
   DVD動画プレーヤー表示
   ========================================================= */

function createVideoPlayer() {

  let videoBox =
    document.getElementById(
      "video-player-box"
    );


  if (videoBox) {

    return videoBox;

  }


  videoBox =
    document.createElement("div");


  videoBox.id =
    "video-player-box";


  videoBox.style.position =
    "fixed";

  videoBox.style.left =
    "0";

  videoBox.style.right =
    "0";

  videoBox.style.top =
    "50%";

  videoBox.style.transform =
    "translateY(-50%)";

  videoBox.style.zIndex =
    "99999";

  videoBox.style.background =
    "#000";

  videoBox.style.padding =
    "20px";

  videoBox.style.boxSizing =
    "border-box";

  videoBox.style.width =
    "100%";

  videoBox.style.maxHeight =
    "100vh";

  videoBox.style.overflow =
    "auto";


  /* =========================
     閉じるボタン
     ========================= */

  const closeButton =
    document.createElement("button");


  closeButton.type =
    "button";

  closeButton.textContent =
    "×";


  closeButton.style.position =
    "absolute";

  closeButton.style.right =
    "10px";

  closeButton.style.top =
    "5px";

  closeButton.style.zIndex =
    "100000";

  closeButton.style.width =
    "45px";

  closeButton.style.height =
    "45px";

  closeButton.style.fontSize =
    "32px";

  closeButton.style.lineHeight =
    "40px";

  closeButton.style.color =
    "#fff";

  closeButton.style.background =
    "rgba(0,0,0,0.7)";

  closeButton.style.border =
    "none";

  closeButton.style.borderRadius =
    "50%";

  closeButton.style.cursor =
    "pointer";


  closeButton.onclick =
    function () {

      closeVideoPlayer();

    };


  videoBox.appendChild(
    closeButton
  );


  /* =========================
     動画本体
     ========================= */

  videoBox.appendChild(
    videoPlayer
  );


  document.body.appendChild(
    videoBox
  );


  return videoBox;

}


/* =========================================================
   DVD動画プレーヤーを閉じる
   ========================================================= */

function closeVideoPlayer() {

  const videoBox =
    document.getElementById(
      "video-player-box"
    );


  videoPlayer.pause();


  videoPlayer.removeAttribute(
    "src"
  );


  videoPlayer.load();


  if (videoBox) {

    videoBox.remove();

  }


  updatePlayIcon(false);

}


/* =========================================================
   DISC2 DVD動画を再生
   ========================================================= */

function playVideo(number) {

  console.log(
    "DISC2動画をクリック:",
    number
  );


  /* =========================
     動画データ確認
     ========================= */

  const videos =
    Array.isArray(window.albumVideos)
      ? window.albumVideos
      : [];


  if (!videos[number]) {

    console.error(
      "動画データがありません:",
      number,
      videos
    );

    return;

  }


  const videoData =
    videos[number];


  console.log(
    "動画タイトル:",
    videoData.title
  );


  console.log(
    "動画URL:",
    videoData.file
  );


  /* =========================
     DISC1音声を停止
     ========================= */

  shouldBePlaying =
    false;


  clearRecoveryTimer();


  player.pause();


  /* =========================
     次の曲の先読み停止
     ========================= */

  nextPlayer.pause();

  nextPlayer.removeAttribute(
    "src"
  );

  nextPlayer.load();


  preloadedSong =
    -1;


  /* =========================
     DISC1の表示を解除
     ========================= */

  document
    .querySelectorAll(".song")
    .forEach(
      function (song) {

        song.classList.remove(
          "playing"
        );

      }
    );


  /* =========================
     DISC2の表示
     ========================= */

  document
    .querySelectorAll("[id^='disc2-song']")
    .forEach(
      function (song) {

        song.classList.remove(
          "playing"
        );

      }
    );


  const songElement =
    document.getElementById(
      "disc2-song" + number
    );


  if (songElement) {

    songElement.classList.add(
      "playing"
    );

  }


  /* =========================
     動画プレーヤーを作成
     ========================= */

  createVideoPlayer();


  /* =========================
     タイトル表示
     ========================= */

  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      videoData.title;

  }


  /* =========================
     動画を完全にリセット
     ========================= */

  videoPlayer.pause();


  videoPlayer.removeAttribute(
    "src"
  );


  videoPlayer.load();


  /* =========================
     動画URLを設定
     ========================= */

  videoPlayer.src =
    videoData.file;


  /* =========================
     動画を読み込む
     ========================= */

  videoPlayer.load();


  /* =========================
     再生開始
     ========================= */

  const startVideo =
    function () {

      console.log(
        "動画再生を開始します"
      );


      videoPlayer
        .play()
        .then(
          function () {

            console.log(
              "動画再生成功:",
              videoData.title
            );

          }
        )
        .catch(
          function (error) {

            console.error(
              "動画再生エラー:",
              error
            );

          }
        );

    };


  /*
   * すでに再生可能なら即再生
   */

  if (
    videoPlayer.readyState >= 3
  ) {

    startVideo();

  } else {

    /*
     * 読み込み完了後に再生
     */

    videoPlayer.addEventListener(
      "canplay",
      startVideo,
      {
        once: true
      }
    );

  }

}


/* =========================================================
   動画エラー表示
   ========================================================= */

videoPlayer.addEventListener(
  "error",
  function () {

    console.error(
      "VIDEO ERROR:",
      videoPlayer.error
    );

  }
);


/* =========================================================
   ページ移動処理
   ========================================================= */

function setupPageNavigation() {

  document.addEventListener(
    "click",
    function (event) {

      const link =
        event.target.closest("a");


      if (!link) {

        return;

      }


      if (

        event.defaultPrevented ||

        event.button !== 0 ||

        event.metaKey ||

        event.ctrlKey ||

        event.shiftKey ||

        event.altKey ||

        link.target === "_blank" ||

        link.hasAttribute("download")

      ) {

        return;

      }


      const href =
        link.getAttribute("href");


      if (!href) {

        return;

      }


      const url =
        new URL(
          href,
          location.href
        );


      if (
        url.origin !==
        location.origin
      ) {

        return;

      }


      if (

        url.pathname ===
        location.pathname &&

        url.search ===
        location.search &&

        url.hash

      ) {

        return;

      }


      const isHTML =

        url.pathname.endsWith(".html") ||

        url.pathname.endsWith("/") ||

        url.pathname === "";


      if (!isHTML) {

        return;

      }


      event.preventDefault();


      navigateTo(
        url.href,
        true
      );

    }
  );


  window.addEventListener(
    "popstate",
    function () {

      navigateTo(
        location.href,
        false
      );

    }
  );

}


/* =========================================================
   ページ遷移アニメーション
   ========================================================= */

function pageTransitionOut() {

  document.body.classList.add(
    "page-transition-out"
  );

}


function pageTransitionIn() {

  document.body.classList.remove(
    "page-transition-out"
  );

  document.body.classList.add(
    "page-transition-in"
  );


  setTimeout(
    function () {

      document.body.classList.remove(
        "page-transition-in"
      );

    },
    350
  );

}


/* =========================================================
   ページ読み込み
   ========================================================= */

async function navigateTo(
  url,
  pushHistory
) {

  pageTransitionOut();


  /* =========================
     動画を閉じる
     ========================= */

  closeVideoPlayer();


  await new Promise(
    function (resolve) {

      setTimeout(
        resolve,
        180
      );

    }
  );


  try {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "ページを読み込めませんでした"
      );

    }


    const html =
      await response.text();


    const parser =
      new DOMParser();


    const newDocument =
      parser.parseFromString(
        html,
        "text/html"
      );


    /* =========================
       履歴
       ========================= */

    if (pushHistory) {

      history.pushState(
        {},
        "",
        url
      );

    }


    /* =========================
       タイトル
       ========================= */

    document.title =
      newDocument.title;


    /* =========================
       body class
       ========================= */

    document.body.className =
      newDocument.body.className;


    /* =========================
       ページ専用CSS
       ========================= */

    document
      .head
      .querySelectorAll(
        "style[data-spa-page-style]"
      )
      .forEach(
        function (style) {

          style.remove();

        }
      );


    newDocument
      .head
      .querySelectorAll("style")
      .forEach(
        function (style) {

          const newStyle =
            document.createElement("style");


          newStyle.dataset.spaPageStyle =
            "true";


          newStyle.textContent =
            style.textContent;


          document.head.appendChild(
            newStyle
          );

        }
      );


    /* =========================
       アルバム情報リセット
       ========================= */

    delete window.albumSongs;

    delete window.albumVideos;


    /* =========================
       ページ内容
       ========================= */

    const root =
      document.getElementById(
        "page-content-root"
      );


    if (!root) {

      location.href =
        url;

      return;

    }


    const contentNodes =
      Array.from(
        newDocument.body.children
      );


    let contentHTML = "";


    contentNodes.forEach(
      function (element) {

        if (

          element.classList.contains("page-tools") ||

          element.classList.contains("nav") ||

          element.classList.contains("player-box")

        ) {

          return;

        }


        if (

          element.tagName === "SCRIPT" &&

          element.src

        ) {

          return;

        }


        contentHTML +=
          element.outerHTML;

      }
    );


    root.innerHTML =
      contentHTML;


    /* =========================
       ページ固有JavaScript
       ========================= */

    const scripts =
      Array.from(
        newDocument.querySelectorAll(
          "body script:not([src])"
        )
      );


    scripts.forEach(
      function (script) {

        const code =
          script.textContent.trim();


        if (!code) {

          return;

        }


        try {

          window.eval(code);

        } catch (error) {

          console.error(
            "ページ固有スクリプトエラー:",
            error
          );

        }

      }
    );


    /* =========================
       戻るボタン
       ========================= */

    const oldTools =
      document.querySelector(
        ".page-tools"
      );


    if (oldTools) {

      oldTools.remove();

    }


    createPageTools();


    /* =========================
       アルバムなら先頭曲
       ========================= */

    if (
      Array.isArray(window.albumSongs)
    ) {

      currentSong =
        0;

    }


    window.scrollTo(
      0,
      0
    );


    pageTransitionIn();


  } catch (error) {

    console.error(
      "ページ遷移エラー:",
      error
    );


    location.href =
      url;

  }

}


/* =========================================================
   曲データ取得
   ========================================================= */

function getSongs() {

  if (

    Array.isArray(activeSongs) &&

    activeSongs.length > 0

  ) {

    return activeSongs;

  }


  if (
    Array.isArray(window.albumSongs)
  ) {

    return window.albumSongs;

  }


  return [];

}


/* =========================================================
   次の曲を先読み
   ========================================================= */

function preloadNextSong() {

  const songs =
    getSongs();


  if (
    songs.length === 0
  ) {

    return;

  }


  let nextSongNumber =
    currentSong + 1;


  if (
    nextSongNumber >=
    songs.length
  ) {

    nextSongNumber =
      0;

  }


  if (
    !songs[nextSongNumber]
  ) {

    return;

  }


  if (

    preloadedSong ===
    nextSongNumber &&

    nextPlayer.src ===
    songs[nextSongNumber].file

  ) {

    return;

  }


  nextPlayer.src =
    songs[nextSongNumber].file;


  nextPlayer.preload =
    "auto";


  nextPlayer.load();


  preloadedSong =
    nextSongNumber;

}


/* =========================================================
   曲を再生
   ========================================================= */

function playSong(number) {

  const pageSongs =
    Array.isArray(window.albumSongs)
      ? window.albumSongs
      : [];


  if (!pageSongs[number]) {

    return;

  }


  /* 動画を閉じる */

  closeVideoPlayer();


  activeSongs =
    pageSongs;


  currentSong =
    number;


  shouldBePlaying =
    true;


  recoveryAttempts =
    0;

  recoveryInProgress =
    false;


  clearRecoveryTimer();


  preloadedSong =
    -1;


  /* =========================
     再生表示
     ========================= */

  document
    .querySelectorAll(".song")
    .forEach(
      function (song) {

        song.classList.remove(
          "playing"
        );

      }
    );


  const songElement =
    document.getElementById(
      "song" + number
    );


  if (songElement) {

    songElement.classList.add(
      "playing"
    );

  }


  /* =========================
     曲名
     ========================= */

  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      activeSongs[number].title;

  }


  /* =========================
     音源
     ========================= */

  player.pause();


  player.src =
    activeSongs[number].file;


  player.preload =
    "auto";


  player.currentTime =
    0;


  preloadNextSong();


  startPlayback();

}


/* =========================================================
   前の曲
   ========================================================= */

function prevSong() {

  const songs =
    getSongs();


  if (
    songs.length === 0
  ) {

    return;

  }


  shouldBePlaying =
    true;


  if (
    currentSong > 0
  ) {

    playStoredSong(
      currentSong - 1
    );

  } else {

    playStoredSong(
      songs.length - 1
    );

  }

}


/* =========================================================
   次の曲
   ========================================================= */

function nextSong() {

  const songs =
    getSongs();


  if (
    songs.length === 0
  ) {

    return;

  }


  shouldBePlaying =
    true;


  if (
    currentSong <
    songs.length - 1
  ) {

    playStoredSong(
      currentSong + 1
    );

  } else {

    playStoredSong(
      0
    );

  }

}


/* =========================================================
   保持している再生リストから再生
   ========================================================= */

function playStoredSong(number) {

  const songs =
    getSongs();


  if (!songs[number]) {

    return;

  }


  closeVideoPlayer();


  currentSong =
    number;


  shouldBePlaying =
    true;


  recoveryAttempts =
    0;

  recoveryInProgress =
    false;


  clearRecoveryTimer();


  document
    .querySelectorAll(".song")
    .forEach(
      function (song) {

        song.classList.remove(
          "playing"
        );

      }
    );


  const songElement =
    document.getElementById(
      "song" + number
    );


  if (songElement) {

    songElement.classList.add(
      "playing"
    );

  }


  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      songs[number].title;

  }


  player.pause();


  player.src =
    songs[number].file;


  player.preload =
    "auto";


  player.currentTime =
    0;


  preloadedSong =
    -1;


  preloadNextSong();


  startPlayback();

}


/* =========================================================
   再生・一時停止ボタン
   ========================================================= */

function togglePlay() {

  /* 動画が表示されている場合 */

  const videoBox =
    document.getElementById(
      "video-player-box"
    );


  if (videoBox) {

    if (videoPlayer.paused) {

      videoPlayer.play()
        .catch(
          function (error) {

            console.error(
              "動画再生エラー:",
              error
            );

          }
        );

    } else {

      videoPlayer.pause();

    }

    return;

  }


  /* 音声 */

  if (!player.src) {

    return;

  }


  if (player.paused) {

    shouldBePlaying =
      true;

    startPlayback();

  } else {

    shouldBePlaying =
      false;

    clearRecoveryTimer();

    player.pause();

  }

}


/* =========================================================
   再生開始
   ========================================================= */

function startPlayback() {

  if (!shouldBePlaying) {

    return;

  }


  clearRecoveryTimer();


  player.play()
    .then(
      function () {

        recoveryAttempts =
          0;

        recoveryInProgress =
          false;


        lastPlaybackTime =
          player.currentTime;


        lastPlaybackCheck =
          Date.now();

      }
    )
    .catch(
      function (error) {

        console.log(
          "再生開始失敗:",
          error
        );


        scheduleRecovery();

      }
    );

}


/* =========================================================
   自動復旧予約
   ========================================================= */

function scheduleRecovery() {

  if (!shouldBePlaying) {

    return;

  }


  if (recoveryTimer) {

    return;

  }


  if (recoveryInProgress) {

    return;

  }


  if (
    recoveryAttempts >=
    MAX_RECOVERY_ATTEMPTS
  ) {

    console.log(
      "自動復旧を5回試しました。"
    );


    recoveryAttempts =
      0;


    return;

  }


  recoveryTimer =
    setTimeout(
      function () {

        recoveryTimer =
          null;

        recoverPlayback();

      },
      2000
    );

}


/* =========================================================
   再生復旧
   ========================================================= */

function recoverPlayback() {

  if (!shouldBePlaying) {

    return;

  }


  if (recoveryInProgress) {

    return;

  }


  recoveryInProgress =
    true;


  recoveryAttempts++;


  const currentPosition =
    player.currentTime;


  player.play()
    .then(
      function () {

        recoveryInProgress =
          false;

        recoveryAttempts =
          0;

        lastPlaybackTime =
          player.currentTime;

        lastPlaybackCheck =
          Date.now();

      }
    )
    .catch(
      function () {

        const songs =
          getSongs();


        if (!songs[currentSong]) {

          recoveryInProgress =
            false;

          return;

        }


        const source =
          songs[currentSong].file;


        player.src =
          source;


        player.preload =
          "auto";


        const restorePosition =
          function () {

            player.removeEventListener(
              "loadedmetadata",
              restorePosition
            );


            try {

              if (

                Number.isFinite(
                  currentPosition
                ) &&

                currentPosition > 0 &&

                Number.isFinite(
                  player.duration
                ) &&

                currentPosition <
                player.duration

              ) {

                player.currentTime =
                  currentPosition;

              }

            } catch (error) {

              console.log(
                "再生位置復元エラー:",
                error
              );

            }


            player.play()
              .then(
                function () {

                  recoveryInProgress =
                    false;

                  recoveryAttempts =
                    0;

                  lastPlaybackTime =
                    player.currentTime;

                  lastPlaybackCheck =
                    Date.now();

                }
              )
              .catch(
                function (error) {

                  console.log(
                    "復旧失敗:",
                    error
                  );

                  recoveryInProgress =
                    false;

                  scheduleRecovery();

                }
              );

          };


        player.addEventListener(
          "loadedmetadata",
          restorePosition
        );


        player.load();

      }
    );

}


/* =========================================================
   復旧タイマー解除
   ========================================================= */

function clearRecoveryTimer() {

  if (recoveryTimer) {

    clearTimeout(
      recoveryTimer
    );

    recoveryTimer =
      null;

  }

}


/* =========================================================
   再生状態監視
   ========================================================= */

setInterval(
  function () {

    if (!shouldBePlaying) {

      return;

    }


    if (!player.src) {

      return;

    }


    if (player.paused) {

      scheduleRecovery();

      return;

    }


    const now =
      Date.now();


    const currentTime =
      player.currentTime;


    if (
      now -
      lastPlaybackCheck >=
      10000
    ) {

      if (
        Math.abs(
          currentTime -
          lastPlaybackTime
        ) < 0.5
      ) {

        scheduleRecovery();

      }


      lastPlaybackTime =
        currentTime;


      lastPlaybackCheck =
        now;

    }

  },
  3000
);


/* =========================================================
   音声エラー監視
   ========================================================= */

player.addEventListener(
  "waiting",
  function () {

    if (!shouldBePlaying) {

      return;

    }

    scheduleRecovery();

  }
);


player.addEventListener(
  "stalled",
  function () {

    if (!shouldBePlaying) {

      return;

    }

    scheduleRecovery();

  }
);


player.addEventListener(
  "error",
  function () {

    if (!shouldBePlaying) {

      return;

    }

    scheduleRecovery();

  }
);


/* =========================================================
   バックグラウンド復帰
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  function () {

    if (
      document.visibilityState !==
      "visible"
    ) {

      return;

    }


    if (

      shouldBePlaying &&

      player.src

    ) {

      setTimeout(
        function () {

          if (

            shouldBePlaying &&

            player.paused

          ) {

            startPlayback();

          }

        },
        500
      );

    }

  }
);


/* =========================================================
   曲の再生終了
   ========================================================= */

player.addEventListener(
  "ended",
  function () {

    if (shouldBePlaying) {

      nextSong();

    }

  }
);


/* =========================================================
   シークバー
   ========================================================= */

function setupSeekBar() {

  const seekBar =
    document.getElementById(
      "seek-bar"
    );


  if (!seekBar) {

    return;

  }


  player.addEventListener(
    "loadedmetadata",
    function () {

      if (
        Number.isFinite(
          player.duration
        )
      ) {

        seekBar.max =
          player.duration;


        const duration =
          document.getElementById(
            "duration"
          );


        if (duration) {

          duration.textContent =
            formatTime(
              player.duration
            );

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
        document.getElementById(
          "current-time"
        );


      if (currentTime) {

        currentTime.textContent =
          formatTime(
            player.currentTime
          );

      }

    }
  );


  seekBar.addEventListener(
    "input",
    function () {

      player.currentTime =
        Number(
          seekBar.value
        );

    }
  );

}


/* =========================================================
   時間表示
   ========================================================= */

function formatTime(seconds) {

  if (
    !Number.isFinite(seconds)
  ) {

    return "0:00";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  const remainingSeconds =
    Math.floor(
      seconds % 60
    )
      .toString()
      .padStart(
        2,
        "0"
      );


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
    document.getElementById(
      "play-icon"
    );


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
   音声プレーヤー状態
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


/* =========================================================
   動画プレーヤー状態
   ========================================================= */

videoPlayer.addEventListener(
  "play",
  function () {

    updatePlayIcon(true);

  }
);


videoPlayer.addEventListener(
  "pause",
  function () {

    updatePlayIcon(false);

  }
);
