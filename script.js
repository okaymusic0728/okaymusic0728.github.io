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
  document.getElementById("song" + number).classList.add("playing");

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
