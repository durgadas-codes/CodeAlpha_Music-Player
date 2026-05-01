const songs = [
  {
    title: "Chill Energy",
    artist: "NCS",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/id/100/300/300"
  },
  {
    title: "Focus Beats",
    artist: "LoFi",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://picsum.photos/id/101/300/300"
  },
  {
    title: "Night Drive",
    artist: "Synthwave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover: "https://picsum.photos/id/102/300/300"
  }
];

let index = 0;
let isShuffle = false;
let isRepeat = false;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const bars = document.querySelectorAll(".equalizer span");

/* Load Song */
function loadSong(i) {
  const song = songs[i];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
  updateActive();
}

/* Play / Pause */
function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  bars.forEach(b => b.style.animationPlayState = "running");
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  bars.forEach(b => b.style.animationPlayState = "paused");
}

playBtn.onclick = () => {
  audio.paused ? playSong() : pauseSong();
};

/* Next / Prev */
nextBtn.onclick = () => {
  if (isShuffle) {
    index = Math.floor(Math.random() * songs.length);
  } else {
    index = (index + 1) % songs.length;
  }
  loadSong(index);
  playSong();
};

prevBtn.onclick = () => {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  playSong();
};

/* Progress */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* Volume */
volume.oninput = () => {
  audio.volume = volume.value;
};

/* Repeat */
audio.onended = () => {
  if (isRepeat) playSong();
  else nextBtn.click();
};

/* Buttons */
document.getElementById("shuffle").onclick = () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle").classList.toggle("active-btn");
};

document.getElementById("repeat").onclick = () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat").classList.toggle("active-btn");
};

document.getElementById("fav").onclick = () => {
  const song = songs[index].title;
  if (favorites.includes(song)) {
    favorites = favorites.filter(f => f !== song);
  } else {
    favorites.push(song);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("❤️ Favorites Updated");
};

/* Search */
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const items = document.querySelectorAll("#playlist li");

  items.forEach((li, i) => {
    const text = songs[i].title.toLowerCase();
    li.style.display = text.includes(value) ? "block" : "none";
  });
});

/* Playlist */
songs.forEach((song, i) => {
  const li = document.createElement("li");
  li.textContent = song.title;
  li.onclick = () => {
    index = i;
    loadSong(index);
    playSong();
  };
  playlist.appendChild(li);
});

function updateActive() {
  const items = document.querySelectorAll("#playlist li");
  items.forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

/* Init */
loadSong(index);
audio.volume = 0.7;