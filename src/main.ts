import "./style.css";
import { settings } from "./settings";
import { hideWidget, setSong, setText } from "./ui";
import { getCurrentSong } from "./subsonic";

const windowParameters = Object.fromEntries(
  new URLSearchParams(window.location.search.substring(1)),
);
console.log(windowParameters);

const settingsResult = settings.safeParse(windowParameters);
if (settingsResult.success) {
  await setupWidget();
} else {
  let str = "errors:\n";

  for (const e of settingsResult.error.issues) {
    str += e.message + "\n";
  }

  setText("status", str);
  hideWidget();
}

async function refreshSong() {
  if (settingsResult.data !== undefined) {
    const song = await getCurrentSong(settingsResult.data);
    setSong(song);
  }
}

async function setupWidget() {
  refreshSong();
  setInterval(refreshSong, 5000);
}
