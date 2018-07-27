import * as pag from "pixel-art-gen";
import * as screen from "./screen";
import { Actor, update as updateActors } from "./actor";
import * as star from "./star";
import * as particle from "./particle";

let stage_: Actor;

window.onload = () => {
  screen.init();
  stage_ = new Actor(stage);
  pag.setSeed(0);
  update();
};

function update() {
  requestAnimationFrame(update);
  star.update();
  particle.update();
  updateActors();
}

function stage(a: Actor) {
  if (a.isSpawning) {
  }
  if (Math.random() < 0.05) {
    new Actor(enemy);
  }
}

async function enemy(a) {
  if (a.isSpawning) {
    const sx = Math.floor(Math.random() * 4) * 0.5 + 1.5;
    const sy = Math.floor(Math.random() * 4) * 0.5 + 1.5;
    a.pos.x = Math.random() * 256;
    a.pos.y = -sy * 12;
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
        scaleX: 2,
        scaleY: 2,
        scalePatternX: sx,
        scalePatternY: sy,
        isLimitingColors: true,
        seed: Math.floor(sx * 2 + sy * 2),
        hue: Math.random() * 0.2,
        colorNoise: 0
      }
    );
    a.imageName = `enemy_${sx}_${sy}`;
    a.setImage(images[0], a.imageName, true);
  }
  a.pos.y += 1;
  particle.emit(
    `j_${a.imageName}`,
    this.pos.x,
    this.pos.y + this.size.y / 2,
    Math.PI / 2,
    {
      hue: Math.random() * 0.2
    }
  );
}
