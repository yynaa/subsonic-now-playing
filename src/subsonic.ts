import { genSaltSync } from "bcrypt-ts";
import { XMLParser } from "fast-xml-parser";
import { md5 } from "js-md5";
import { ofetch } from "ofetch";
import type { Settings } from "./settings";
import type { Song } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function getRequestURL(
  url: string,
  path: string,
  user: string,
  pass: string,
  searchParams: URLSearchParams,
) {
  const salt = genSaltSync(10);
  const token = md5(pass + salt);

  let pathParams = new URLSearchParams();
  pathParams.append("v", "6.1.4");
  pathParams.append("c", "subsonic-now-playing");
  pathParams.append("u", user);
  pathParams.append("s", salt);
  pathParams.append("t", token);

  const combinedParams = new URLSearchParams([...pathParams, ...searchParams]);

  return url + "/rest/" + path + "?" + combinedParams.toString();
}

export async function getCurrentSong(settings: Settings): Promise<Song> {
  const queueXMLData = await ofetch(
    getRequestURL(
      settings.url,
      "getPlayQueue",
      settings.user,
      settings.pass,
      new URLSearchParams(),
    ),
  );
  const queueData = parser.parse(queueXMLData)["subsonic-response"];
  const currentSongID = queueData["playQueue"]["current"];

  const songXMLData = await ofetch(
    getRequestURL(
      settings.url,
      "getSong",
      settings.user,
      settings.pass,
      new URLSearchParams({
        id: currentSongID,
      }),
    ),
  );
  const songData = parser.parse(songXMLData)["subsonic-response"];
  const song = songData["song"];

  const coverBlob = await ofetch(
    getRequestURL(
      settings.url,
      "getCoverArt",
      settings.user,
      settings.pass,
      new URLSearchParams({
        id: currentSongID,
      }),
    ),
  );
  const coverUrl = URL.createObjectURL(coverBlob);

  let artists: string[] = [];
  if (typeof song["artists"][Symbol.iterator] === "function") {
    for (const a of song["artists"]) {
      artists.push(a["name"]);
    }
  } else {
    artists.push(song["artists"]["name"]);
  }

  return {
    title: song["title"],
    artists,
    track: song["track"],
    album: song["album"],
    cover: coverUrl,
  };
}
