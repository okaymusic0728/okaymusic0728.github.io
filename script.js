/* =========================================================
   Okay MUSIC 共通システム
   ========================================================= */

(() => {

/* =========================================================
   共通オーディオプレーヤー
   ========================================================= */

const player = new Audio();
let currentSong = 0;

const nextPlayer = new Audio();
let preloadedSong = -1;

let activeSongs = [];

let shouldBePlaying = false;
let recoveryTimer = null;
let recoveryAttempts = 0;
let recoveryInProgress = false;
let lastPlaybackTime = 0;
let lastPlaybackCheck = Date.now();

const MAX_RECOVERY_ATTEMPTS = 5;


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

let currentVideo = -1;
let activeVideos = [];
let videoIsPlaying = false;
let videoMiniMode = false;


/* =========================================================
   DOM準備
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupPageRoot();
    createPageTools();
    createNavigation();
    createPlayer();
    setupSeekBar();
    setupPageNavigation();

    exposeCommonFunctions();
});


/* =========================================================
   共通関数をwindowへ公開
   ========================================================= */

function exposeCommonFunctions() {

    window.playSong = playSong;
    window.prevSong = prevSong;
    window.nextSong = nextSong;
    window.togglePlay = togglePlay;

    window.playVideo = playVideo;
    window.previousVideo = previousVideo;
    window.nextVideo = nextVideo;
    window.toggleVideoPlay = toggleVideoPlay;
    window.toggleVideoFullscreen = toggleVideoFullscreen;
    window.toggleVideoPiP = toggleVideoPiP;
    window.minimizeVideoPlayer = minimizeVideoPlayer;
    window.restoreVideoPlayer = restoreVideoPlayer;
    window.closeVideoPlayer = closeVideoPlayer;

    window.goBack = goBack;
}


/* =========================================================
   ページルート
   ========================================================= */

function setupPageRoot() {

    if (document.getElementById("page-content-root")) {
        return;
    }

    const root = document.createElement("div");
    root.id = "page-content-root";

    const children = Array.from(document.body.children);

    children.forEach(el => {

        if (
            el.classList.contains("page-tools") ||
            el.classList.contains("nav") ||
            el.classList.contains("player-box") ||
            el.id === "video-player-box"
        ) {
            return;
        }

        root.appendChild(el);
    });

    document.body.appendChild(root);
}


/* =========================================================
   戻るボタン
   ========================================================= */

function createPageTools() {

    if (document.querySelector(".page-tools")) {
        return;
    }

    const tools = document.createElement("div");
    tools.className = "page-tools";

    tools.innerHTML = `
        <button
            type="button"
            onclick="goBack()"
            style="
                border:none;
                background:none;
                font-size:14px;
                cursor:pointer;
                padding:8px 12px;
            "
        >
            ← 戻る
        </button>
    `;

    document.body.appendChild(tools);
}


function goBack() {

    if (history.length > 1) {
        history.back();
    } else {
        window.location.href = "index.html";
    }
}


/* =========================================================
   下部ナビゲーション
   ========================================================= */

function createNavigation() {

    if (document.querySelector(".nav")) {
        return;
    }

    const nav = document.createElement("nav");
    nav.className = "nav";

    nav.innerHTML = `
        <a href="index.html">
            <i class="fa-solid fa-house"></i>
            <span>HOME</span>
        </a>

        <a href="news.html">
            <i class="fa-solid fa-newspaper"></i>
            <span>NEWS</span>
        </a>

        <a href="radio.html">
            <i class="fa-solid fa-radio"></i>
            <span>RADIO</span>
        </a>

        <a href="search.html">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>SEARCH</span>
        </a>
    `;

    document.body.appendChild(nav);
}


/* =========================================================
   共通オーディオプレーヤーUI
   ========================================================= */

function createPlayer() {

    if (document.querySelector(".player-box")) {
        return;
    }

    const box = document.createElement("div");
    box.className = "player-box";

    box.innerHTML = `
        <div
            id="now-title"
            style="
                font-size:13px;
                margin-bottom:6px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            "
        >
            -
        </div>

        <div
            style="
                display:flex;
                align-items:center;
                justify-content:center;
                gap:18px;
            "
        >
            <button id="prev-button" type="button">
                <i class="fa-solid fa-backward-step"></i>
            </button>

            <button id="play-button" type="button">
                <i class="fa-solid fa-play"></i>
            </button>

            <button id="next-button" type="button">
                <i class="fa-solid fa-forward-step"></i>
            </button>
        </div>

        <div
            style="
                display:flex;
                align-items:center;
                gap:8px;
                margin-top:7px;
            "
        >
            <span id="current-time">0:00</span>

            <input
                id="seek-bar"
                type="range"
                min="0"
                max="100"
                value="0"
                step="0.1"
                style="flex:1;"
            >

            <span id="duration">0:00</span>
        </div>
    `;

    document.body.appendChild(box);

    document
        .getElementById("prev-button")
        .addEventListener("click", prevSong);

    document
        .getElementById("play-button")
        .addEventListener("click", togglePlay);

    document
        .getElementById("next-button")
        .addEventListener("click", nextSong);
}


/* =========================================================
   共通ビデオプレーヤーUI
   ========================================================= */

function createVideoPlayer() {

    let box = document.getElementById("video-player-box");

    if (box) {
        return box;
    }

    box = document.createElement("div");
    box.id = "video-player-box";

    box.innerHTML = `
        <div
            id="video-player-title"
            style="
                color:#fff;
                font-size:14px;
                padding:10px 12px;
                text-align:center;
                background:#111;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            "
        >
            -
        </div>

        <button
            id="video-close-button"
            type="button"
            aria-label="閉じる"
            style="
                position:absolute;
                top:7px;
                right:7px;
                z-index:20;
                width:34px;
                height:34px;
                border:none;
                border-radius:50%;
                background:rgba(0,0,0,.65);
                color:#fff;
                font-size:20px;
                cursor:pointer;
            "
        >
            ×
        </button>
    `;

    box.style.position = "fixed";
    box.style.left = "50%";
    box.style.top = "50%";
    box.style.transform = "translate(-50%, -50%)";
    box.style.width = "min(96vw, 1000px)";
    box.style.maxHeight = "94vh";
    box.style.background = "#000";
    box.style.zIndex = "99999";
    box.style.borderRadius = "8px";
    box.style.overflow = "hidden";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,.6)";

    box.appendChild(videoPlayer);

    const controls = document.createElement("div");

    controls.id = "video-custom-controls";

    controls.style.display = "flex";
    controls.style.alignItems = "center";
    controls.style.justifyContent = "center";
    controls.style.gap = "10px";
    controls.style.padding = "8px";
    controls.style.background = "#111";

    controls.innerHTML = `
        <button id="video-prev-button" type="button">
            <i class="fa-solid fa-backward-step"></i>
        </button>

        <button id="video-play-button" type="button">
            <i class="fa-solid fa-play"></i>
        </button>

        <button id="video-next-button" type="button">
            <i class="fa-solid fa-forward-step"></i>
        </button>

        <button id="video-pip-button" type="button">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
        </button>

        <button id="video-fullscreen-button" type="button">
            <i class="fa-solid fa-expand"></i>
        </button>
    `;

    box.appendChild(controls);
    document.body.appendChild(box);

    document
        .getElementById("video-close-button")
        .addEventListener("click", minimizeVideoPlayer);

    document
        .getElementById("video-prev-button")
        .addEventListener("click", previousVideo);

    document
        .getElementById("video-play-button")
        .addEventListener("click", toggleVideoPlay);

    document
        .getElementById("video-next-button")
        .addEventListener("click", nextVideo);

    document
        .getElementById("video-pip-button")
        .addEventListener("click", toggleVideoPiP);

    document
        .getElementById("video-fullscreen-button")
        .addEventListener("click", toggleVideoFullscreen);

    return box;
}


/* =========================================================
   動画一覧
   ========================================================= */

function getVideos() {

    if (
        Array.isArray(window.albumVideos) &&
        window.albumVideos.length > 0
    ) {
        return window.albumVideos;
    }

    return [];
}


/* =========================================================
   動画再生
   ========================================================= */

function playVideo(number) {

    const videos = getVideos();

    if (!videos.length) {
        return;
    }

    if (
        number < 0 ||
        number >= videos.length
    ) {
        return;
    }

    activeVideos = videos.slice();
    currentVideo = number;
    videoMiniMode = false;

    /* 音声を停止 */
    shouldBePlaying = false;

    player.pause();
    nextPlayer.pause();

    preloadedSong = -1;

    /* 古い動画プレーヤーを作成 */
    const box = createVideoPlayer();

    box.style.left = "50%";
    box.style.top = "50%";
    box.style.right = "auto";
    box.style.bottom = "auto";
    box.style.width = "min(96vw, 1000px)";
    box.style.maxHeight = "94vh";
    box.style.transform = "translate(-50%, -50%)";

    /* 古いアルバムページに残っている動画エリアを隠す */
    const oldVideoArea = document.getElementById("videoArea");

    if (oldVideoArea) {
        oldVideoArea.style.display = "none";
    }

    document
        .querySelectorAll(".song")
        .forEach(el => el.classList.remove("playing"));

    const currentButton =
        document.getElementById("disc2-song" + number) ||
        document.querySelector(
            `[onclick*="playVideo(${number})"]`
        );

    if (currentButton) {
        currentButton.classList.add("playing");
    }

    const data = activeVideos[number];

    if (!data || !data.file) {
        return;
    }

    const title =
        data.title ||
        data.name ||
        `VIDEO ${String(number + 1).padStart(2, "0")}`;

    const titleElement =
        document.getElementById("video-player-title");

    if (titleElement) {
        titleElement.textContent = title;
    }

    const nowTitle =
        document.getElementById("now-title");

    if (nowTitle) {
        nowTitle.textContent = title;
    }

    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();

    videoPlayer.src = data.file;
    videoPlayer.currentTime = 0;

    updateVideoControls();

    videoPlayer.load();

    const startPlayback = () => {

        videoPlayer
            .play()
            .then(() => {
                videoIsPlaying = true;
                updateVideoControls();
                updateVideoMediaSession(title);
            })
            .catch(() => {
                videoIsPlaying = false;
                updateVideoControls();
            });
    };

    if (videoPlayer.readyState >= 2) {
        startPlayback();
    } else {
        videoPlayer.addEventListener(
            "canplay",
            startPlayback,
            { once: true }
        );
    }
}


/* =========================================================
   動画 次へ
   ========================================================= */

function nextVideo() {

    if (!activeVideos.length) {
        activeVideos = getVideos().slice();
    }

    if (!activeVideos.length) {
        return;
    }

    if (
        currentVideo < activeVideos.length - 1
    ) {
        playVideo(currentVideo + 1);
    } else {
        videoPlayer.pause();
        videoIsPlaying = false;
        updateVideoControls();
    }
}


/* =========================================================
   動画 前へ
   ========================================================= */

function previousVideo() {

    if (!activeVideos.length) {
        activeVideos = getVideos().slice();
    }

    if (!activeVideos.length) {
        return;
    }

    if (currentVideo > 0) {
        playVideo(currentVideo - 1);
    } else {
        videoPlayer.currentTime = 0;

        if (videoPlayer.paused) {
            videoPlayer.play().catch(() => {});
        }
    }
}


/* =========================================================
   動画 再生/一時停止
   ========================================================= */

function toggleVideoPlay() {

    if (videoPlayer.paused) {

        videoPlayer
            .play()
            .then(() => {
                videoIsPlaying = true;
                updateVideoControls();
            })
            .catch(() => {});

    } else {

        videoPlayer.pause();
        videoIsPlaying = false;
        updateVideoControls();
    }
}


/* =========================================================
   動画コントロール更新
   ========================================================= */

function updateVideoControls() {

    const playButton =
        document.getElementById("video-play-button");

    const prevButton =
        document.getElementById("video-prev-button");

    const nextButton =
        document.getElementById("video-next-button");

    if (playButton) {

        playButton.innerHTML =
            videoPlayer.paused
                ? `<i class="fa-solid fa-play"></i>`
                : `<i class="fa-solid fa-pause"></i>`;
    }

    if (prevButton) {
        prevButton.disabled = currentVideo <= 0;
    }

    if (nextButton) {
        nextButton.disabled =
            !activeVideos.length ||
            currentVideo >= activeVideos.length - 1;
    }
}


/* =========================================================
   動画 フルスクリーン
   ========================================================= */

async function toggleVideoFullscreen() {

    const box =
        document.getElementById("video-player-box");

    if (!box) {
        return;
    }

    try {

        if (!document.fullscreenElement) {

            if (box.requestFullscreen) {
                await box.requestFullscreen();
            } else if (box.webkitRequestFullscreen) {
                box.webkitRequestFullscreen();
            }

            if (
                screen.orientation &&
                screen.orientation.lock
            ) {
                try {
                    await screen.orientation.lock("landscape");
                } catch (e) {}
            }

        } else {

            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }

    } catch (e) {}
}


/* =========================================================
   動画 PiP
   ========================================================= */

async function toggleVideoPiP() {

    try {

        if (document.pictureInPictureElement) {

            await document.exitPictureInPicture();
            return;
        }

        if (
            document.pictureInPictureEnabled &&
            videoPlayer.requestPictureInPicture
        ) {
            await videoPlayer.requestPictureInPicture();
            return;
        }

        if (
            videoPlayer.webkitSetPresentationMode
        ) {
            const mode =
                videoPlayer.webkitPresentationMode;

            if (mode === "picture-in-picture") {
                videoPlayer.webkitSetPresentationMode("inline");
            } else {
                videoPlayer.webkitSetPresentationMode(
                    "picture-in-picture"
                );
            }
        }

    } catch (e) {}
}


/* =========================================================
   動画 小窓化
   ========================================================= */

function minimizeVideoPlayer() {

    const box =
        document.getElementById("video-player-box");

    if (!box) {
        return;
    }

    videoMiniMode = true;

    box.style.left = "auto";
    box.style.top = "auto";
    box.style.right = "12px";
    box.style.bottom = "78px";
    box.style.transform = "none";
    box.style.width = "360px";
    box.style.maxWidth = "calc(100vw - 24px)";
    box.style.maxHeight = "220px";
    box.style.borderRadius = "8px";

    videoPlayer.style.maxHeight = "160px";

    const title =
        document.getElementById("video-player-title");

    if (title) {
        title.style.display = "none";
    }
}


/* =========================================================
   動画 小窓から復帰
   ========================================================= */

function restoreVideoPlayer() {

    const box =
        document.getElementById("video-player-box");

    if (!box) {
        return;
    }

    videoMiniMode = false;

    box.style.left = "50%";
    box.style.top = "50%";
    box.style.right = "auto";
    box.style.bottom = "auto";
    box.style.transform = "translate(-50%, -50%)";
    box.style.width = "min(96vw, 1000px)";
    box.style.maxHeight = "94vh";

    videoPlayer.style.maxHeight = "72vh";

    const title =
        document.getElementById("video-player-title");

    if (title) {
        title.style.display = "block";
    }
}


/* =========================================================
   動画を閉じる
   ========================================================= */

function closeVideoPlayer() {

    const box =
        document.getElementById("video-player-box");

    videoPlayer.pause();

    videoPlayer.removeAttribute("src");
    videoPlayer.load();

    videoIsPlaying = false;
    currentVideo = -1;
    activeVideos = [];
    videoMiniMode = false;

    if (box) {
        box.remove();
    }

    document
        .querySelectorAll(".song")
        .forEach(el => el.classList.remove("playing"));
}


/* =========================================================
   小窓動画クリックで復帰
   ========================================================= */

videoPlayer.addEventListener("click", () => {

    if (videoMiniMode) {
        restoreVideoPlayer();
    }
});


/* =========================================================
   動画 再生イベント
   ========================================================= */

videoPlayer.addEventListener("play", () => {

    videoIsPlaying = true;

    updateVideoControls();

    const title =
        activeVideos[currentVideo]?.title ||
        activeVideos[currentVideo]?.name ||
        "Okay MUSIC";

    updateVideoMediaSession(title);
});


/* =========================================================
   動画 一時停止イベント
   ========================================================= */

videoPlayer.addEventListener("pause", () => {

    videoIsPlaying = false;

    updateVideoControls();

    if (
        navigator.mediaSession &&
        navigator.mediaSession.playbackState
    ) {
        navigator.mediaSession.playbackState = "paused";
    }
});


/* =========================================================
   動画 終了
   ========================================================= */

videoPlayer.addEventListener("ended", () => {

    videoIsPlaying = false;

    if (
        currentVideo >= 0 &&
        currentVideo < activeVideos.length - 1
    ) {
        nextVideo();
    } else {
        updateVideoControls();
    }
});


/* =========================================================
   動画 エラー
   ========================================================= */

videoPlayer.addEventListener("error", () => {

    videoIsPlaying = false;

    updateVideoControls();
});


/* =========================================================
   フルスクリーン変更
   ========================================================= */

document.addEventListener("fullscreenchange", () => {

    const box =
        document.getElementById("video-player-box");

    if (!box) {
        return;
    }

    if (document.fullscreenElement === box) {

        box.style.width = "100vw";
        box.style.height = "100vh";
        box.style.maxWidth = "100vw";
        box.style.maxHeight = "100vh";
        box.style.left = "0";
        box.style.top = "0";
        box.style.transform = "none";
        box.style.borderRadius = "0";

        videoPlayer.style.maxHeight =
            "calc(100vh - 90px)";

    } else {

        if (!videoMiniMode) {
            box.style.width = "min(96vw, 1000px)";
            box.style.height = "auto";
            box.style.maxWidth = "96vw";
            box.style.maxHeight = "94vh";
            box.style.left = "50%";
            box.style.top = "50%";
            box.style.transform =
                "translate(-50%, -50%)";
            box.style.borderRadius = "8px";

            videoPlayer.style.maxHeight = "72vh";
        }
    }
});


/* =========================================================
   動画 Media Session
   ========================================================= */

function updateVideoMediaSession(title) {

    if (!("mediaSession" in navigator)) {
        return;
    }

    try {

        navigator.mediaSession.metadata =
            new MediaMetadata({
                title: title,
                artist: "SUPER BEAVER",
                album: "Okay MUSIC"
            });

        navigator.mediaSession.playbackState =
            videoPlayer.paused
                ? "paused"
                : "playing";

    } catch (e) {}
}


/* =========================================================
   オーディオ曲一覧
   ========================================================= */

function getSongs() {

    if (
        Array.isArray(window.albumSongs) &&
        window.albumSongs.length > 0
    ) {
        return window.albumSongs;
    }

    return [];
}


/* =========================================================
   次曲プリロード
   ========================================================= */

function preloadNextSong() {

    if (!activeSongs.length) {
        return;
    }

    const nextIndex = currentSong + 1;

    if (
        nextIndex < 0 ||
        nextIndex >= activeSongs.length
    ) {
        return;
    }

    if (preloadedSong === nextIndex) {
        return;
    }

    const nextSong = activeSongs[nextIndex];

    if (!nextSong || !nextSong.file) {
        return;
    }

    nextPlayer.src = nextSong.file;
    nextPlayer.load();

    preloadedSong = nextIndex;
}


/* =========================================================
   曲再生
   ========================================================= */

function playSong(number) {

    const songs = getSongs();

    if (!songs.length) {
        return;
    }

    if (
        number < 0 ||
        number >= songs.length
    ) {
        return;
    }

    activeSongs = songs.slice();
    currentSong = number;

    closeVideoPlayer();

    const song = activeSongs[number];

    if (!song || !song.file) {
        return;
    }

    shouldBePlaying = true;
    recoveryAttempts = 0;

    player.src = song.file;
    player.currentTime = 0;

    const title =
        song.title ||
        song.name ||
        `TRACK ${String(number + 1).padStart(2, "0")}`;

    const nowTitle =
        document.getElementById("now-title");

    if (nowTitle) {
        nowTitle.textContent = title;
    }

    document
        .querySelectorAll(".song")
        .forEach(el => el.classList.remove("playing"));

    const currentButton =
        document.getElementById("song" + number) ||
        document.getElementById("disc1-song" + number) ||
        document.querySelector(
            `[onclick*="playSong(${number})"]`
        );

    if (currentButton) {
        currentButton.classList.add("playing");
    }

    player.load();

    player
        .play()
        .then(() => {

            shouldBePlaying = true;
            recoveryAttempts = 0;

            updatePlayIcon();
            preloadNextSong();
            updateAudioMediaSession(title);

        })
        .catch(() => {

            shouldBePlaying = false;
            updatePlayIcon();

        });
}


/* =========================================================
   前曲
   ========================================================= */

function prevSong() {

    if (!activeSongs.length) {
        activeSongs = getSongs().slice();
    }

    if (!activeSongs.length) {
        return;
    }

    if (currentSong > 0) {
        playSong(currentSong - 1);
    } else {
        player.currentTime = 0;
    }
}


/* =========================================================
   次曲
   ========================================================= */

function nextSong() {

    if (!activeSongs.length) {
        activeSongs = getSongs().slice();
    }

    if (!activeSongs.length) {
        return;
    }

    if (
        currentSong <
        activeSongs.length - 1
    ) {
        playSong(currentSong + 1);
    } else {

        player.pause();
        shouldBePlaying = false;

        updatePlayIcon();
    }
}


/* =========================================================
   保存曲再生
   ========================================================= */

function playStoredSong() {

    const songs = getSongs();

    if (!songs.length) {
        return;
    }

    if (
        currentSong < 0 ||
        currentSong >= songs.length
    ) {
        currentSong = 0;
    }

    activeSongs = songs.slice();

    closeVideoPlayer();

    const song = activeSongs[currentSong];

    if (!song || !song.file) {
        return;
    }

    player.src = song.file;

    player
        .play()
        .then(() => {

            shouldBePlaying = true;
            updatePlayIcon();
            preloadNextSong();

        })
        .catch(() => {});
}


/* =========================================================
   再生/一時停止
   ========================================================= */

function togglePlay() {

    if (player.paused) {

        if (!player.src) {
            playStoredSong();
            return;
        }

        player
            .play()
            .then(() => {

                shouldBePlaying = true;
                updatePlayIcon();

            })
            .catch(() => {});

    } else {

        player.pause();

        shouldBePlaying = false;

        updatePlayIcon();
    }
}


/* =========================================================
   再生開始
   ========================================================= */

function startPlayback() {

    if (!player.src) {
        return;
    }

    player
        .play()
        .then(() => {

            shouldBePlaying = true;
            recoveryAttempts = 0;

            updatePlayIcon();

        })
        .catch(() => {});
}


/* =========================================================
   再生アイコン
   ========================================================= */

function updatePlayIcon() {

    const button =
        document.getElementById("play-button");

    if (!button) {
        return;
    }

    button.innerHTML =
        player.paused
            ? `<i class="fa-solid fa-play"></i>`
            : `<i class="fa-solid fa-pause"></i>`;
}


/* =========================================================
   時間表示
   ========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        String(secs).padStart(2, "0")
    );
}


/* =========================================================
   シークバー
   ========================================================= */

function setupSeekBar() {

    const seekBar =
        document.getElementById("seek-bar");

    if (!seekBar) {
        return;
    }

    seekBar.addEventListener("input", () => {

        if (!Number.isFinite(player.duration)) {
            return;
        }

        player.currentTime =
            (seekBar.value / 100) *
            player.duration;
    });
}


/* =========================================================
   オーディオ時間更新
   ========================================================= */

player.addEventListener("timeupdate", () => {

    const current =
        document.getElementById("current-time");

    const duration =
        document.getElementById("duration");

    const seekBar =
        document.getElementById("seek-bar");

    if (current) {
        current.textContent =
            formatTime(player.currentTime);
    }

    if (duration) {
        duration.textContent =
            formatTime(player.duration);
    }

    if (
        seekBar &&
        Number.isFinite(player.duration) &&
        player.duration > 0
    ) {
        seekBar.value =
            (player.currentTime /
                player.duration) *
            100;
    }

    lastPlaybackTime =
        player.currentTime;

    lastPlaybackCheck =
        Date.now();
});


/* =========================================================
   オーディオロードメタデータ
   ========================================================= */

player.addEventListener("loadedmetadata", () => {

    const duration =
        document.getElementById("duration");

    if (duration) {
        duration.textContent =
            formatTime(player.duration);
    }
});


/* =========================================================
   オーディオ ended
   ========================================================= */

player.addEventListener("ended", () => {

    shouldBePlaying = false;

    if (
        currentSong <
        activeSongs.length - 1
    ) {
        playSong(currentSong + 1);
    } else {
        updatePlayIcon();
    }
});


/* =========================================================
   オーディオ play
   ========================================================= */

player.addEventListener("play", () => {

    shouldBePlaying = true;

    updatePlayIcon();

    if (
        navigator.mediaSession &&
        navigator.mediaSession.playbackState !==
            "playing"
    ) {
        navigator.mediaSession.playbackState =
            "playing";
    }
});


/* =========================================================
   オーディオ pause
   ========================================================= */

player.addEventListener("pause", () => {

    if (!player.ended) {
        shouldBePlaying = false;
    }

    updatePlayIcon();

    if (
        navigator.mediaSession
    ) {
        navigator.mediaSession.playbackState =
            "paused";
    }
});


/* =========================================================
   オーディオエラー
   ========================================================= */

player.addEventListener("error", () => {

    if (
        shouldBePlaying &&
        recoveryAttempts < MAX_RECOVERY_ATTEMPTS
    ) {
        scheduleAudioRecovery();
    }
});


/* =========================================================
   オーディオ Media Session
   ========================================================= */

function updateAudioMediaSession(title) {

    if (!("mediaSession" in navigator)) {
        return;
    }

    try {

        navigator.mediaSession.metadata =
            new MediaMetadata({
                title: title,
                artist: "Okay MUSIC",
                album: "Okay MUSIC"
            });

        navigator.mediaSession.playbackState =
            player.paused
                ? "paused"
                : "playing";

    } catch (e) {}
}


/* =========================================================
   オーディオ再生復旧
   ========================================================= */

function scheduleAudioRecovery() {

    if (recoveryInProgress) {
        return;
    }

    clearTimeout(recoveryTimer);

    recoveryTimer =
        setTimeout(
            recoverAudio,
            500
        );
}


function recoverAudio() {

    if (!shouldBePlaying) {
        return;
    }

    if (
        recoveryAttempts >=
        MAX_RECOVERY_ATTEMPTS
    ) {
        shouldBePlaying = false;
        updatePlayIcon();
        return;
    }

    recoveryInProgress = true;
    recoveryAttempts++;

    const currentSrc = player.src;
    const currentTime = player.currentTime;

    player.pause();

    if (currentSrc) {
        player.src = currentSrc;
        player.load();

        const restorePlayback = () => {

            try {
                player.currentTime =
                    currentTime || 0;
            } catch (e) {}

            player
                .play()
                .then(() => {

                    recoveryInProgress = false;
                    recoveryAttempts = 0;
                    shouldBePlaying = true;

                    updatePlayIcon();

                })
                .catch(() => {

                    recoveryInProgress = false;

                    if (shouldBePlaying) {
                        scheduleAudioRecovery();
                    }

                });
        };

        player.addEventListener(
            "canplay",
            restorePlayback,
            { once: true }
        );
    } else {
        recoveryInProgress = false;
    }
}


/* =========================================================
   visibilitychange
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {
            lastPlaybackCheck =
                Date.now();

            if (
                shouldBePlaying &&
                player.paused &&
                !player.ended
            ) {
                startPlayback();
            }
        }
    }
);


/* =========================================================
   Media Session 共通操作
   ========================================================= */

if ("mediaSession" in navigator) {

    try {

        navigator.mediaSession.setActionHandler(
            "play",
            () => {

                if (
                    videoIsPlaying ||
                    !videoPlayer.paused
                ) {
                    videoPlayer.play().catch(() => {});
                } else {
                    player.play().catch(() => {});
                }
            }
        );

    } catch (e) {}

    try {

        navigator.mediaSession.setActionHandler(
            "pause",
            () => {

                if (
                    videoIsPlaying ||
                    !videoPlayer.paused
                ) {
                    videoPlayer.pause();
                } else {
                    player.pause();
                }
            }
        );

    } catch (e) {}

    try {

        navigator.mediaSession.setActionHandler(
            "nexttrack",
            () => {

                if (
                    activeVideos.length &&
                    currentVideo >= 0
                ) {
                    nextVideo();
                } else {
                    nextSong();
                }
            }
        );

    } catch (e) {}

    try {

        navigator.mediaSession.setActionHandler(
            "previoustrack",
            () => {

                if (
                    activeVideos.length &&
                    currentVideo >= 0
                ) {
                    previousVideo();
                } else {
                    prevSong();
                }
            }
        );

    } catch (e) {}

    try {

        navigator.mediaSession.setActionHandler(
            "seekbackward",
            details => {

                const amount =
                    details.seekOffset || 10;

                if (
                    activeVideos.length &&
                    currentVideo >= 0
                ) {
                    videoPlayer.currentTime =
                        Math.max(
                            0,
                            videoPlayer.currentTime -
                                amount
                        );
                } else {
                    player.currentTime =
                        Math.max(
                            0,
                            player.currentTime -
                                amount
                        );
                }
            }
        );

    } catch (e) {}

    try {

        navigator.mediaSession.setActionHandler(
            "seekforward",
            details => {

                const amount =
                    details.seekOffset || 10;

                if (
                    activeVideos.length &&
                    currentVideo >= 0
                ) {
                    videoPlayer.currentTime =
                        Math.min(
                            videoPlayer.duration || 0,
                            videoPlayer.currentTime +
                                amount
                        );
                } else {
                    player.currentTime =
                        Math.min(
                            player.duration || 0,
                            player.currentTime +
                                amount
                        );
                }
            }
        );

    } catch (e) {}
}


/* =========================================================
   ページナビゲーション
   ========================================================= */

function setupPageNavigation() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest("a");

            if (!link) {
                return;
            }

            if (
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                link.href.startsWith("mailto:") ||
                link.href.startsWith("tel:")
            ) {
                return;
            }

            const url =
                new URL(
                    link.href,
                    location.href
                );

            if (
                url.origin !== location.origin
            ) {
                return;
            }

            if (
                url.pathname.endsWith(".html") ||
                url.pathname === "/"
            ) {

                event.preventDefault();

                navigateTo(
                    url.pathname +
                    url.search +
                    url.hash
                );
            }
        }
    );

    window.addEventListener(
        "popstate",
        () => {
            navigateTo(
                location.pathname +
                location.search +
                location.hash,
                false
            );
        }
    );
}


/* =========================================================
   ページ移動
   ========================================================= */

async function navigateTo(
    url,
    push = true
) {

    try {

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "ページ取得失敗"
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

        const newRoot =
            newDocument.querySelector(
                "#page-content-root"
            ) ||
            newDocument.body;

        const currentRoot =
            document.getElementById(
                "page-content-root"
            );

        if (!currentRoot) {
            window.location.href = url;
            return;
        }

        /*
         * 動画再生中なら現在の動画は維持する。
         * 新しいページのalbumVideosとは分離して管理する。
         */
        const keepVideo =
            currentVideo >= 0 &&
            activeVideos.length > 0 &&
            !videoPlayer.paused;

        if (!keepVideo) {
            closeVideoPlayer();
        }

        /* 現在ページのアルバムデータを消去 */
        delete window.albumSongs;
        delete window.albumVideos;

        currentRoot.innerHTML =
            newRoot.innerHTML;

        /*
         * ページ内scriptはnew Functionで実行。
         * const player / const videoPlayer等が
         * 共通scriptと衝突しないようにする。
         */
        const scripts =
            newDocument.body.querySelectorAll(
                "script:not([src])"
            );

        scripts.forEach(script => {

            const code =
                script.textContent.trim();

            if (!code) {
                return;
            }

            try {

                const run =
                    new Function(code);

                run();

            } catch (error) {

                console.error(
                    "Page script error:",
                    error
                );
            }
        });

        if (push) {
            history.pushState(
                {},
                "",
                url
            );
        }

        document.title =
            newDocument.title ||
            document.title;

        /*
         * ページ側の古い関数定義を上書きし、
         * 常に共通システムを使う。
         */
        exposeCommonFunctions();

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        /*
         * 小窓動画を維持している場合、
         * 現在の動画をそのまま表示する。
         */
        if (keepVideo) {

            const box =
                document.getElementById(
                    "video-player-box"
                );

            if (!box) {
                createVideoPlayer();
            }

            minimizeVideoPlayer();
        }

    } catch (error) {

        console.error(
            "navigateTo error:",
            error
        );

        window.location.href = url;
    }
}


/* =========================================================
   初期ページでも共通関数を確実に使用
   ========================================================= */

exposeCommonFunctions();


})();
