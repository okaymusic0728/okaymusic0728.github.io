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


function playSong(number) {

  const player = document.getElementById("player");

  currentSong = number;

  // 前に光っていた曲を消す
  document.querySelectorAll(".song").forEach(function(song){
    song.classList.remove("playing");
  });

  // 今の曲を光らせる

const songElement =
document.getElementById("song" + number);


if(songElement){

  songElement.classList.add("playing");

}
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
