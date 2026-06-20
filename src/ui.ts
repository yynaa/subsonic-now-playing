import type { Song } from "./types";

export function setText(id: string, msg: string) {
  const s = document.getElementById(id);
  if (s !== null) {
    s.textContent = msg;
  }
}

function setImage(id: string, url: string) {
  const s = document.getElementById(id) as HTMLImageElement | null;
  if (s !== null) {
    s.src = url;
  }
}

export function setSong(song: Song) {
  setImage("cover", song.cover);
  setImage("coverBackground", song.cover);
  setText("title", song.title);
  setText("artists", song.artists.join(", "));
  setText("album", song.album);
  setText("track", "Track " + song.track);
}

export function hideWidget() {
  const s = document.getElementById("widget");
  if (s !== null) {
    s.classList.add("widgetHidden");
  }
}
