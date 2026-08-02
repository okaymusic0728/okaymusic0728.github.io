function playSong(file) {

  const player = document.getElementById("player");

  player.src = "audio/" + file;

  player.play();

}
