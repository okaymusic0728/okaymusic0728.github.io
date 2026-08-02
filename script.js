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

  player.src = songs[number].file;

  document.getElementById("now-title").innerHTML =
  songs[number].title;


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
