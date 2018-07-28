import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";

export let family: string;
let container: PIXI.Container;

export function init(
  parent: PIXI.Container,
  padding: number,
  _family = "Hannari",
  url = "https://fonts.googleapis.com/earlyaccess/hannari.css"
) {
  container = new PIXI.Container();
  container.x = container.y = padding;
  parent.addChild(container);
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
  container.addChild(text);
  return text;
}
