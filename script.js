/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */


/* =========================================================
   共通オーディオプレーヤー
   ========================================================= */

const player = new Audio();

let currentSong = 0;


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
   共通UIを自動生成
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* =========================
       ページ内容を入れる共通領域
       ========================= */

    setupPageRoot();


    /* =========================
       左上：戻る・更新
       TOPページ以外に自動表示
       ========================= */

    createPageTools();


    /* =========================
       下部4ボタン
       全ページ共通
       ========================= */

    createNavigation();


    /* =========================
       共通プレーヤー
       全ページ共通
       ========================= */

    createPlayer();


    /* =========================
       シークバー設定
       ========================= */

    setupSeekBar();


    /* =========================
       ページ内リンクを共通処理
       ========================= */

 setupPageNavigation();

  }
);


/* =========================================================
   共通ページ領域
   ========================================================= */

function setupPageRoot() {


  if (
    document.getElementById(
      "page-content-root"
    )
  ) {

    return;

  }


  const root =
    document.createElement(
      "div"
    );


  root.id =
    "page-content-root";


  const children =
    Array.from(
      document.body.children
    );


  children.forEach(
    function (element) {


      if (

        element.classList.contains(
          "page-tools"
        ) ||

        element.classList.contains(
          "nav"
        ) ||

        element.classList.contains(
          "player-box"
        )

      ) {

        return;

      }


      root.appendChild(
        element
      );

    }
  );


  document.body.insertBefore(
    root,
    document.body.firstChild
  );


  /* 現在のページ専用CSSを識別 */

  document
    .head
    .querySelectorAll(
      "style"
    )
    .forEach(
      function (style) {

        style.dataset.spaPageStyle =
          "true";

      }
    );

}


/* =========================================================
   戻る・更新ボタン
   ========================================================= */

function createPageTools() {


  if (

    !document.querySelector(
      ".page-tools"
    ) &&

    !document.body.classList.contains(
      "home-page"
    )

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
    document.querySelector(
      ".nav"
    )
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
    document.querySelector(
      ".player-box"
    )
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
   ページ移動処理
   ========================================================= */

function setupPageNavigation() {


  document.addEventListener(
    "click",

    function (event) {


      const link =
        event.target.closest(
          "a"
        );


      if (!link) {

        return;

      }


      /* 新しいタブなどは通常動作 */

      if (

        event.defaultPrevented ||

        event.button !== 0 ||

        event.metaKey ||

        event.ctrlKey ||

        event.shiftKey ||

        event.altKey ||

        link.target === "_blank" ||

        link.hasAttribute(
          "download"
        )

      ) {

        return;

      }


      const href =
        link.getAttribute(
          "href"
        );


      if (!href) {

        return;

      }


      /* 外部リンクは通常動作 */

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


      /* ページ内アンカーのみの場合 */

      if (

        url.pathname ===
        location.pathname &&

        url.search ===
        location.search &&

        url.hash

      ) {

        return;

      }


      /*
       * HTMLページだけSPA遷移
       */

      const isHTML =

        url.pathname.endsWith(
          ".html"
        ) ||

        url.pathname.endsWith(
          "/"
        ) ||

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


  /* 戻る・進む */

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
   ページ読み込み
   ========================================================= */

async function navigateTo(
  url,
  pushHistory
) {


  try {


    const response =
      await fetch(
        url
      );


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


    /*
     * 履歴を追加
     */

    if (pushHistory) {


      history.pushState(
        {},
        "",
        url
      );

    }


    /*
     * タイトル変更
     */

    document.title =
      newDocument.title;


    /*
     * body class変更
     */

    document.body.className =
      newDocument.body.className;


    /*
     * 現在ページ用CSSを交換
     */

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
      .querySelectorAll(
        "style"
      )
      .forEach(
        function (style) {


          const newStyle =
            document.createElement(
              "style"
            );


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
     * albumSongsを一度リセット
     */

    delete window.albumSongs;


    /*
     * 新しいページ本文を取得
     */

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


    let contentHTML =
      "";


    contentNodes.forEach(
      function (element) {


        if (

          element.classList.contains(
            "page-tools"
          ) ||

          element.classList.contains(
            "nav"
          ) ||

          element.classList.contains(
            "player-box"
          )

        ) {

          return;

        }


        /*
         * script.js本体は入れない
         */

        if (

          element.tagName ===
          "SCRIPT" &&

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
     * ページ固有の
     * インラインJavaScriptを実行
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


          window.eval(
            code
          );


        } catch (error) {


          console.error(
            "ページ固有スクリプトエラー:",
            error
          );

        }

      }
    );


    /*
     * 新しいページの戻るボタンを調整
     */

    const oldTools =
      document.querySelector(
        ".page-tools"
      );


    if (oldTools) {

      oldTools.remove();

    }


    createPageTools();


    /*
     * アルバムページなら
     * 現在位置を初期化
     */

    if (
      Array.isArray(
        window.albumSongs
      )
    ) {

      currentSong =
        0;

    }


    /*
     * スクロール位置
     */

    window.scrollTo(
      0,
      0
    );


  } catch (error) {


    console.error(
      "ページ遷移エラー:",
      error
    );


    /*
     * 失敗した場合は
     * 通常のページ移動
     */

    location.href =
      url;

  }

}


/* =========================================================
   曲データ取得
   ========================================================= */

function getSongs() {


  /*
   * 現在再生中の
   * アルバム情報を優先
   */

  if (

    Array.isArray(
      activeSongs
    ) &&

    activeSongs.length > 0

  ) {

    return activeSongs;

  }


  /*
   * 現在のページの曲情報
   */

  if (
    Array.isArray(
      window.albumSongs
    )
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


  /*
   * 次の曲番号
   */

  let nextSongNumber =
    currentSong + 1;


  /*
   * 最後の曲なら
   * 最初の曲を先読み
   */

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


  /*
   * 同じ曲を
   * すでに先読み済みなら
   * 再読み込みしない
   */

  if (

    preloadedSong ===
    nextSongNumber &&

    nextPlayer.src ===
    songs[nextSongNumber].file

  ) {

    return;

  }


  /*
   * 次の曲を読み込み
   */

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

function playSong(
  number
) {


  const pageSongs =
    Array.isArray(
      window.albumSongs
    )
      ? window.albumSongs
      : [];


  /*
   * 現在ページの曲をクリックした場合
   * そのアルバムを
   * 新しい再生リストにする
   */

  if (
    !pageSongs[number]
  ) {

    return;

  }


  activeSongs =
    pageSongs;


  currentSong =
    number;


  /*
   * 先読み状態をリセット
   */

  preloadedSong =
    -1;


  /*
   * 曲一覧の再生中表示
   */

  document
    .querySelectorAll(
      ".song"
    )
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


  /*
   * 曲名表示
   */

  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      activeSongs[number].title;

  }


  /*
   * 音源設定
   */

  player.src =
    activeSongs[number].file;


  player.preload =
    "auto";


  player.currentTime =
    0;


  /*
   * 次の曲を先読み
   */

  preloadNextSong();


  /*
   * 再生
   */

  player.play()
    .catch(
      function (error) {

        console.log(
          "再生できませんでした:",
          error
        );

      }
    );

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

function playStoredSong(
  number
) {


  const songs =
    getSongs();


  if (
    !songs[number]
  ) {

    return;

  }


  currentSong =
    number;


  /*
   * 曲一覧の再生中表示
   */

  document
    .querySelectorAll(
      ".song"
    )
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


  /*
   * 曲名表示
   */

  const nowTitle =
    document.getElementById(
      "now-title"
    );


  if (nowTitle) {

    nowTitle.textContent =
      songs[number].title;

  }


  /*
   * 音源設定
   */

  player.src =
    songs[number].file;


  player.preload =
    "auto";


  player.currentTime =
    0;


  /*
   * 次の曲を先読み
   */

  preloadedSong =
    -1;


  preloadNextSong();


  /*
   * 再生
   */

  player.play()
    .catch(
      function (error) {

        console.log(
          "再生できませんでした:",
          error
        );

      }
    );

}


/* =========================================================
   再生・一時停止
   ========================================================= */

function togglePlay() {


  const songs =
    getSongs();


  /*
   * まだ曲を選択していない場合
   */

  if (
    !player.src
  ) {


    if (
      songs.length > 0
    ) {

      playStoredSong(
        currentSong
      );

    }


    return;

  }


  /*
   * 一時停止中なら再生
   */

  if (
    player.paused
  ) {


    player.play()
      .catch(
        function (error) {

          console.log(
            "再生できませんでした:",
            error
          );

        }
      );


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
    document.getElementById(
      "seek-bar"
    );


  if (!seekBar) {

    return;

  }


  /*
   * 曲の長さ取得
   */

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


  /*
   * 再生時間更新
   */

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


  /*
   * シークバー操作
   */

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

function formatTime(
  seconds
) {


  if (
    !Number.isFinite(
      seconds
    )
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

function updatePlayIcon(
  isPlaying
) {


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
   再生状態をボタンに反映
   ========================================================= */

player.addEventListener(
  "play",

  function () {

    updatePlayIcon(
      true
    );

  }
);


player.addEventListener(
  "pause",

  function () {

    updatePlayIcon(
      false
    );

  }
);
