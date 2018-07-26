import * as pag from "pixel-art-gen";
import * as screen from "./screen";
import * as actor from "./actor";
import * as particle from "./particle";

window.onload = () => {
  screen.init();
  update();
};

let ship: actor.Actor;
let ticks = 0;

async function update() {
  requestAnimationFrame(update);
  if (ship == null) {
    ship = new actor.Actor();
    const images = await pag.generateImagesPromise(
      `
    --
    --
    --
  ----
  ----
  ----
    `,
      {
        isMirrorX: true,
        scale: 2,
        scalePattern: 2,
        isLimitingColors: true,
        colorNoise: 0
      }
    );
    ship.setImage(images[0], "ship", true);
    ship.pos.y = 128;
  }
  ship.pos.x = 128 + Math.sin(ticks * 0.1) * 50;
  if (Math.random() < 0.1) {
    particle.emit("e1", Math.random() * 256, Math.random() * 256);
  }
  particle.update();
  actor.update();
  ticks++;
}
