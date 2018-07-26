import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import { screen } from "./screen";

export let family: string;

export function init(
  _family = "Hannari",
  url = "https://fonts.googleapis.com/earlyaccess/hannari.css"
) {
  family = _family;
  return new Promise((resolve, reject) => {
    WebFont.load({
      custom: {
        families: [family],
        urls: [url]
      },
      active: () => resolve(),
      inactive: () => reject()
    });
  });
}

export function add(x, y, size = 14, fill = "white") {
  const text = new PIXI.Text("", {
    fontFamily: family,
    fontSize: size,
    fill
  });
  text.x = x;
  text.y = y;
  screen.addChild(text);
  return text;
}
