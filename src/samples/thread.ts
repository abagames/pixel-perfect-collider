import * as PIXI from "pixi.js";
import * as pag from "pixel-art-gen";
import * as sss from "sounds-some-sounds";
import * as ppe from "particle-pattern-emitter";
import * as screen from "./util/screen";
import { Actor, reset as resetActor } from "./util/actor";
import * as sga from "./util/simpleGameActor";
import * as text from "./util/text";
import * as particle from "./util/particle";
import * as pointer from "./util/pointer";
import Vector from "./util/vector";
import * as star from "./util/star";

let stage_: Actor;
let player_: Actor;
let score = 0;
let scoreText: PIXI.Text;
let gameOverText: PIXI.Text;
let title: Actor;
let scene: "title" | "game" | "gameOver";
let sceneTicks = 0;
let pagSeed: number;

window.onload = () => {
  screen.init(container => {
    star.init(screen.app, container, screen.padding);
  });
  pag.setDefaultOptions({
    isMirrorX: true,
    scale: 2,
    isLimitingColors: true,
    colorLighting: 0.5,
    colorNoise: 0
  });
  sss.init();
  setPagSeed();
  sss.setSeed(1);
  ppe.setSeed(1);
  pointer.init(
    screen.app.view,
    new Vector(screen.size),
    new Vector(screen.padding),
    sss.playEmpty
  );
  scoreText = text.add(0, 0);
  gameOverText = text.add(128, 128);
  gameOverText.visible = false;
  gameOverText.text = "Game over";
  gameOverText.anchor.x = gameOverText.anchor.y = 0.5;
  stage_ = new Actor(stage);
  beginTitle();
  update();
};

function update() {
  requestAnimationFrame(update);
  sss.update();
  pointer.update();
  star.update();
  particle.update();
  sga.pool.update();
  scoreText.text = `${score}`;
}

function beginTitle() {
  scene = "title";
  gameOverText.visible = false;
  title = new Actor();
  title.pos.set(128, 80);
  title.setImage(
    pag.generateImages("THREAD", {
      isMirrorX: false,
      isInnerEdge: true,
      scalePattern: 1.5,
      scale: 2,
      isUsingLetterForm: true,
      letterFormChar: "*",
      letterFormFontFamily: text.family,
      letterWidthRatio: 0.7,
      letterHeightRatio: 1.1,
      hue: 0.4
    })[0],
    `Title_${pagSeed}`,
    false
  );
}

function beginGame() {
  scene = "game";
  gameOverText.visible = false;
  sga.pool.removeAll();
  setPagSeed();
  stage_ = new Actor(stage);
  player_ = new Actor(player);
  sss.playBgm();
  sss.playJingle("s_start");
  score = 0;
  stage_.ticks = 0;
}

function setPagSeed() {
  pagSeed = Math.random() * 9999999;
  resetActor();
  pag.setSeed(pagSeed);
}

function endGame() {
  scene = "gameOver";
  gameOverText.visible = true;
  sss.stopBgm();
  sceneTicks = 0;
}

function stage(a: Actor) {
  if (
    (scene === "title" || (scene === "gameOver" && sceneTicks > 40)) &&
    pointer.isPressed
  ) {
    beginGame();
  }
  if (scene === "gameOver" && sceneTicks > 180) {
    beginTitle();
  }
  if (Math.random() < 0.01 * (Math.sqrt(a.ticks / 100) + 1)) {
    new Actor(enemy);
  }
  sceneTicks++;
}

async function enemy(a) {
  if (a.isSpawning) {
    const sx = Math.floor(Math.random() * 6) * 0.5 + 1.5;
    const sy = Math.floor(Math.random() * 6) * 0.5 + 1.5;
    a.pos.x = Math.random() * 256;
    a.pos.y = -sy * 8;
    const images = await pag.generateImagesPromise(
      `
--
--
 -
 -
  `,
      {
        scalePatternX: sx,
        scalePatternY: sy,
        seed: Math.floor(sx * 2 + sy * 2),
        hue: Math.random() * 0.2
      }
    );
    a.imageName = `enemy_${sx}_${sy}_${pagSeed}`;
    a.setImage(images[0], a.imageName, true);
    a.vy = 1 + Math.random() * (a.ticks / 100 + 1);
    if (scene === "game") {
      sss.play(
        `h_${a.imageName}`,
        1,
        82 - Math.floor(sx + sy) * 3,
        undefined,
        0.3
      );
    }
  }
  a.pos.y += a.vy;
  particle.emit(
    `j_${a.imageName}`,
    a.pos.x,
    a.pos.y - a.size.y / 2,
    -Math.PI / 2,
    {
      hue: 0.6 + Math.random() * 0.1,
      countScale: 0.25
    }
  );
  if (
    player_ != null &&
    player_.collider != null &&
    player_.collider.test(a.collider)
  ) {
    player_.remove();
    particle.emit("e_player", player_.pos.x, player_.pos.y, 0, {
      sizeScale: 2,
      countScale: 2
    });
    sss.playJingle("e_player", true, undefined, undefined, undefined, 5);
    player_ = null;
    endGame();
  }
}

async function player(a) {
  const maxSizeIndex = 7;
  if (a.isSpawning) {
    let imagePromises = [];
    for (let i = 0; i < maxSizeIndex; i++) {
      let ps = (i + 1) * 2;
      let scale = Math.sqrt(ps) * 0.8;
      let scalePattern = ps / scale;
      imagePromises.push(
        pag.generateImagesPromise(
          `
  -
  -
- -
---
 --
`,
          {
            scale,
            scalePattern,
            hue: 0.4
          }
        )
      );
    }
    Promise.all(imagePromises).then(images => {
      a.images = images.map(i => i[0]);
    });
    a.pos.set(128, 200);
    pointer.setTargetPos(a.pos);
    a.mvSize = 0;
    a.pSzi = 0;
  }
  a.pos.set(pointer.targetPos);
  a.pos.clamp(0, 255, 0, 255);
  a.mvSize += (pointer.move.length() * 2 - a.mvSize) * 0.05;
  if (a.images != null) {
    const szi = Math.min(Math.floor(a.mvSize), maxSizeIndex - 1);
    a.setImage(a.images[szi], `player_${szi}_${pagSeed}`, true);
    particle.emit(`j_player`, a.pos.x, a.pos.y + a.size.y / 2, Math.PI / 2, {
      hue: 0.3
    });
    if (a.pSzi != szi) {
      sss.play(`s_szi_${szi}`, 2, 50 + szi * 5, null, 0.3);
      a.pSzi = szi;
    }
    score += szi * szi;
  }
}
