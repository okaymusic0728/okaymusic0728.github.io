```javascript
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
videoPlayer.style.maxWidth = "100%";
videoPlayer.style.maxHeight = "72vh";
videoPlayer.style.height = "auto";
videoPlayer.style.margin = "0 auto";
videoPlayer.style.background = "#000";
videoPlayer.style.objectFit = "contain";


/* =========================================================
   動画状態
   ========================================================= */

let currentVideo = -1;

let videoIsPlaying = false;

let videoMiniMode = false;


/* =========================================================
   次の曲の先読み
   ========================================================= */

const nextPlayer = new Audio();

let preloadedSong = -1;


/* =========================================================
   再生中のアルバム情報
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
   共通UI
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
   DVD動画プレーヤー作成
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
    "10px";

  videoBox.style.boxSizing =
    "border-box";

  videoBox.style.width =
    "100%";

  videoBox.style.maxHeight =
    "100vh";

  videoBox.style.overflow =
    "hidden";


  /* =====================================================
     動画タイトル
     ===================================================== */

  const title =
    document.createElement("div");


  title.id =
    "video-player-title";


  title.style.color =
    "#fff";

  title.style.fontSize =
    "15px";

  title.style.fontWeight =
    "bold";

  title.style.padding =
    "4px 50px 8px 5px";

  title.style.whiteSpace =
    "nowrap";

  title.style.overflow =
    "hidden";

  title.style.textOverflow =
    "ellipsis";


  videoBox.appendChild(
    title
  );


  /* =====================================================
     閉じるボタン
     ===================================================== */

  const closeButton =
    document.createElement("button");


  closeButton.type =
    "button";

  closeButton.textContent =
    "×";


  closeButton.style.position =
    "absolute";

  closeButton.style.right =
    "8px";

  closeButton.style.top =
    "5px";

  closeButton.style.zIndex =
    "100001";

  closeButton.style.width =
    "42px";

  closeButton.style.height =
    "42px";

  closeButton.style.fontSize =
    "30px";

  closeButton.style.lineHeight =
    "38px";

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

      minimizeVideoPlayer();

    };


  videoBox.appendChild(
    closeButton
  );


  /* =====================================================
     動画本体
     ===================================================== */

  videoBox.appendChild(
    videoPlayer
  );


  /* =====================================================
     独自動画ボタン
     ===================================================== */

  const controls =
    document.createElement("div");


  controls.id =
    "video-extra-controls";


  controls.style.display =
    "flex";

  controls.style.alignItems =
    "center";

  controls.style.justifyContent =
    "center";

  controls.style.gap =
    "8px";

  controls.style.padding =
    "8px 0 3px";

  controls.style.background =
    "#000";


  controls.innerHTML = `

    <button
      type="button"
      id="video-prev-button"
      title="前のチャプター">

      ⏮

    </button>


    <button
      type="button"
      id="video-play-button"
      title="再生・一時停止">

      ▶

    </button>


    <button
      type="button"
      id="video-next-button"
      title="次のチャプター">

      ⏭

    </button>


    <button
      type="button"
      id="video-pip-button"
      title="小窓再生">

      ▣

    </button>


    <button
      type="button"
      id="video-fullscreen-button"
      title="フルスクリーン">

      ⛶

    </button>

  `;


  Array.from(
    controls.querySelectorAll("button")
  ).forEach(
    function (button) {

      button.style.color =
        "#fff";

      button.style.background =
        "#222";

      button.style.border =
        "1px solid #555";

      button.style.borderRadius =
        "6px";

      button.style.fontSize =
        "20px";

      button.style.minWidth =
        "48px";

      button.style.height =
        "42px";

      button.style.cursor =
        "pointer";

    }
  );


  videoBox.appendChild(
    controls
  );


  /* =====================================================
     ボタンイベント
     ===================================================== */

  document
    .getElementById("video-prev-button")
    .onclick =
    function () {

      previousVideo();

    };


  document
    .getElementById("video-next-button")
    .onclick =
    function () {

      nextVideo();

    };


  document
    .getElementById("video-play-button")
    .onclick =
    function () {

      toggleVideoPlay();

    };


  document
    .getElementById("video-fullscreen-button")
    .onclick =
    function () {

      toggleVideoFullscreen();

    };


  document
    .getElementById("video-pip-button")
    .onclick =
    function () {

      toggleVideoPiP();

    };


  document.body.appendChild(
    videoBox
  );


  updateVideoControls();


  return videoBox;

}


/* =========================================================
   動画タイトル更新
   ========================================================= */

function updateVideoTitle(titleText) {

  const title =
    document.getElementById(
      "video-player-title"
    );


  if (title) {

    title.textContent =
      titleText || "";

  }

}


/* =========================================================
   動画コントロール更新
   ========================================================= */

function updateVideoControls() {

  const videos =
    getVideos();


  const prevButton =
    document.getElementById(
      "video-prev-button"
    );


  const nextButton =
    document.getElementById(
      "video-next-button"
    );


  const playButton =
    document.getElementById(
      "video-play-button"
    );


  if (prevButton) {

    prevButton.disabled =
      currentVideo <= 0;

    prevButton.style.opacity =
      currentVideo <= 0 ? "0.35" : "1";

  }


  if (nextButton) {

    nextButton.disabled =
      currentVideo >= videos.length - 1;

    nextButton.style.opacity =
      currentVideo >= videos.length - 1
        ? "0.35"
        : "1";

  }


  if (playButton) {

    playButton.textContent =
      videoPlayer.paused
        ? "▶"
        : "⏸";

  }

}


/* =========================================================
   動画データ取得
   ========================================================= */

function getVideos() {

  if (
    Array.isArray(window.albumVideos)
  ) {

    return window.albumVideos;

  }


  return [];

}


/* =========================================================
   DISC2動画再生
   ========================================================= */

function playVideo(number) {

  console.log(
    "DISC2動画をクリック:",
    number
  );


  const videos =
    getVideos();


  if (!videos[number]) {

    console.error(
      "動画データがありません:",
      number,
      videos
    );

    return;

  }


  currentVideo =
    number;


  videoMiniMode =
    false;


  /* =====================================================
     音楽停止
     ===================================================== */

  shouldBePlaying =
    false;


  clearRecoveryTimer();

  player.pause();


  nextPlayer.pause();

  nextPlayer.removeAttribute(
    "src"
  );

  nextPlayer.load();


  preloadedSong =
    -1;


  /* =====================================================
     再生表示
     ===================================================== */

  document
    .querySelectorAll(".song")
    .forEach(
      function (song) {

        song.classList.remove(
          "playing"
        );

      }
    );


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


  /* =====================================================
     プレーヤー表示
     ===================================================== */

  createVideoPlayer();


  const videoData =
    videos[number];


  updateVideoTitle(
    videoData.title
  );


  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      videoData.title;

  }


  /* =====================================================
     動画セット
     ===================================================== */

  videoPlayer.pause();

  videoPlayer.removeAttribute(
    "src"
  );

  videoPlayer.load();


  videoPlayer.src =
    videoData.file;


  videoPlayer.load();


  updateVideoControls();


  /* =====================================================
     再生
     ===================================================== */

  const startVideo =
    function () {

      videoPlayer
        .play()
        .then(
          function () {

            videoIsPlaying =
              true;

            updateVideoControls();

            updatePlayIcon(true);

          }
        )
        .catch(
          function (error) {

            console.error(
              "動画再生エラー:",
              error
            );

            updateVideoControls();

          }
        );

    };


  if (
    videoPlayer.readyState >= 3
  ) {

    startVideo();

  } else {

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
   次の動画
   ========================================================= */

function nextVideo() {

  const videos =
    getVideos();


  if (
    videos.length === 0
  ) {

    return;

  }


  if (
    currentVideo >=
    videos.length - 1
  ) {

    videoPlayer.pause();

    videoIsPlaying =
      false;

    updateVideoControls();

    return;

  }


  playVideo(
    currentVideo + 1
  );

}


/* =========================================================
   前の動画
   ========================================================= */

function previousVideo() {

  const videos =
    getVideos();


  if (
    videos.length === 0
  ) {

    return;

  }


  if (
    currentVideo <= 0
  ) {

    videoPlayer.currentTime =
      0;

    return;

  }


  playVideo(
    currentVideo - 1
  );

}


/* =========================================================
   動画終了 → 自動で次へ
   ========================================================= */

videoPlayer.addEventListener(
  "ended",
  function () {

    console.log(
      "動画終了。次のチャプターへ"
    );


    const videos =
      getVideos();


    if (
      currentVideo <
      videos.length - 1
    ) {

      nextVideo();

    } else {

      videoIsPlaying =
        false;

      updateVideoControls();

      updatePlayIcon(false);

    }

  }
);


/* =========================================================
   動画再生・一時停止
   ========================================================= */

function toggleVideoPlay() {

  if (
    videoPlayer.paused
  ) {

    videoPlayer
      .play()
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

}


/* =========================================================
   動画フルスクリーン
   ========================================================= */

async function toggleVideoFullscreen() {

  try {

    if (
      document.fullscreenElement
    ) {

      await document.exitFullscreen();

      return;

    }


    const target =
      document.getElementById(
        "video-player-box"
      );


    if (!target) {

      return;

    }


    if (
      target.requestFullscreen
    ) {

      await target.requestFullscreen();

    }


    /*
     * スマホなどで横向きを要求
     */

    if (
      screen.orientation &&
      screen.orientation.lock
    ) {

      try {

        await screen.orientation.lock(
          "landscape"
        );

      } catch (error) {

        console.log(
          "画面回転ロック非対応:",
          error
        );

      }

    }

  } catch (error) {

    console.error(
      "フルスクリーンエラー:",
      error
    );

  }

}


/* =========================================================
   フルスクリーン終了時
   ========================================================= */

document.addEventListener(
  "fullscreenchange",
  function () {

    if (
      !document.fullscreenElement
    ) {

      if (
        screen.orientation &&
        screen.orientation.unlock
      ) {

        try {

          screen.orientation.unlock();

        } catch (error) {

        }

      }

    }

  }
);


/* =========================================================
   Picture-in-Picture
   ========================================================= */

async function toggleVideoPiP() {

  try {

    if (
      document.pictureInPictureElement
    ) {

      await document.exitPictureInPicture();

      return;

    }


    if (
      document.pictureInPictureEnabled &&
      !videoPlayer.disablePictureInPicture
    ) {

      await videoPlayer.requestPictureInPicture();

    } else {

      console.log(
        "Picture-in-Picture非対応"
      );

    }

  } catch (error) {

    console.error(
      "PiPエラー:",
      error
    );

  }

}


/* =========================================================
   動画を小型プレイヤー化
   ========================================================= */

function minimizeVideoPlayer() {

  const videoBox =
    document.getElementById(
      "video-player-box"
    );


  if (!videoBox) {

    return;

  }


  videoMiniMode =
    true;


  videoBox.style.top =
    "auto";

  videoBox.style.left =
    "auto";

  videoBox.style.right =
    "12px";

  videoBox.style.bottom =
    "80px";

  videoBox.style.transform =
    "none";

  videoBox.style.width =
    "360px";

  videoBox.style.maxWidth =
    "calc(100vw - 24px)";

  videoBox.style.padding =
    "6px";

  videoBox.style.borderRadius =
    "10px";

  videoBox.style.boxShadow =
    "0 4px 25px rgba(0,0,0,0.5)";


  videoPlayer.style.maxHeight =
    "200px";


  const controls =
    document.getElementById(
      "video-extra-controls"
    );


  if (controls) {

    controls.style.padding =
      "3px 0";

  }

}


/* =========================================================
   動画を通常サイズに戻す
   ========================================================= */

function restoreVideoPlayer() {

  const videoBox =
    document.getElementById(
      "video-player-box"
    );


  if (!videoBox) {

    return;

  }


  videoMiniMode =
    false;


  videoBox.style.top =
    "50%";

  videoBox.style.left =
    "0";

  videoBox.style.right =
    "0";

  videoBox.style.bottom =
    "auto";

  videoBox.style.transform =
    "translateY(-50%)";

  videoBox.style.width =
    "100%";

  videoBox.style.maxWidth =
    "none";

  videoBox.style.padding =
    "10px";

  videoBox.style.borderRadius =
    "0";

  videoBox.style.boxShadow =
    "none";


  videoPlayer.style.maxHeight =
    "72vh";

}


/* =========================================================
   動画クリックで通常サイズに戻す
   ========================================================= */

videoPlayer.addEventListener(
  "click",
  function () {

    if (videoMiniMode) {

      restoreVideoPlayer();

    }

  }
);


/* =========================================================
   動画再生状態
   ========================================================= */

videoPlayer.addEventListener(
  "play",
  function () {

    videoIsPlaying =
      true;

    updateVideoControls();

    updatePlayIcon(true);

  }
);


videoPlayer.addEventListener(
  "pause",
  function () {

    videoIsPlaying =
      false;

    updateVideoControls();

    updatePlayIcon(false);

  }
);


/* =========================================================
   動画エラー
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


    if (pushHistory) {

      history.pushState(
        {},
        "",
        url
      );

    }


    document.title =
      newDocument.title;


    document.body.className =
      newDocument.body.className;


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


    /*
     * 動画を再生中の場合は
     * albumVideosを消さない。
     */

    if (
      !document.getElementById(
        "video-player-box"
      )
    ) {

      delete window.albumVideos;

    }


    delete window.albumSongs;


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

          element.classList.contains("player-box") ||

          element.id === "video-player-box"

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


    /*
     * ページ固有JavaScript
     */

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


    const oldTools =
      document.querySelector(
        ".page-tools"
      );


    if (oldTools) {

      oldTools.remove();

    }


    createPageTools();


    if (
      Array.isArray(window.albumSongs)
    ) {

      currentSong =
        0;

    }


    /*
     * 動画プレイヤーが存在する場合
     * ページ移動しても残す。
     */

    const existingVideoBox =
      document.getElementById(
        "video-player-box"
      );


    if (existingVideoBox) {

      existingVideoBox.style.zIndex =
        "99999";

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


  /*
   * 動画を停止
   */

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
      activeSongs[number].title;

  }


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
   再生・一時停止
   ========================================================= */

function togglePlay() {

  const videoBox =
    document.getElementById(
      "video-player-box"
    );


  if (videoBox) {

    toggleVideoPlay();

    return;

  }


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


        player.src =
          songs[currentSong].file;


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

            }


            player.play()
              .then(
                function () {

                  recoveryInProgress =
                    false;

                  recoveryAttempts =
                    0;

                }
              )
              .catch(
                function () {

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
   再生アイコン
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

    if (
      !document.getElementById(
        "video-player-box"
      )
    ) {

      updatePlayIcon(false);

    }

  }
);
```
