import * as pag from "pixel-art-gen";
import * as screen from "./screen";
import { Actor, update as updateActors } from "./actor";
import * as particle from "./particle";

let stage_: Actor;

window.onload = () => {
  screen.init();
  stage_ = new Actor(stage);
  update();
};

function update() {
  requestAnimationFrame(update);
  particle.update();
  updateActors();
}

function stage(a: Actor) {
  if (a.isSpawning) {
    new Actor(ship);
  }
  if (Math.random() < 0.1) {
    particle.emit("e1", Math.random() * 256, Math.random() * 256);
  }
}

async function ship(a: Actor) {
  if (a.isSpawning) {
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
    a.setImage(images[0], "ship", true);
    a.pos.y = 128;
  }
  a.pos.x = 128 + Math.sin(stage_.ticks * 0.1) * 50;
}
