import * as PIXI from "pixi.js";
import * as sga from "./simpleGameActor";

let starContainer: PIXI.particles.ParticleContainer;
let starTexture: PIXI.Texture;
const starBaseSize = 2;

export function init(
  app: PIXI.Application,
  parent: PIXI.Container,
  padding: number
) {
  starContainer = new PIXI.particles.ParticleContainer(
    1000,
    {
      scale: true,
      position: true,
      alpha: true
    },
    1000
  );
  starContainer.x = starContainer.y = padding;
  parent.addChild(starContainer);
  const g = new PIXI.Graphics();
  g.beginFill(0xffffff);
  g.drawRect(0, 0, starBaseSize, starBaseSize);
  g.endFill();
  starTexture = app.renderer.generateTexture(g);
  add();
}

let pool = new sga.Pool();

function add() {
  for (let i = 0; i < 100; i++) {
    let vy = Math.random() * 2 + 1;
    new sga.Actor(
      star,
      Math.random() * 256,
      Math.random() * 256,
      vy / 3,
      vy + 1,
      (randomColor() << 16) | (randomColor() << 8) | randomColor(),
      pool
    );
  }
}

function randomColor() {
  return Math.floor(Math.random() * 2) * 127 + 128;
}

export function update() {
  pool.update();
}

interface Star extends sga.Actor {
  vy: number;
  baseSize: number;
  sprite: PIXI.Sprite;
}

function star(
  s: Star,
  x: number,
  y: number,
  vy: number,
  size: number,
  tint: number
) {
  if (s.isSpawning) {
    s.vy = vy;
    s.sprite = new PIXI.Sprite(starTexture);
    s.sprite.x = x;
    s.sprite.y = y;
    s.sprite.anchor.x = s.sprite.anchor.y = 0.5;
    s.sprite.scale.x = s.sprite.scale.y = size / starBaseSize;
    s.sprite.tint = tint;
    starContainer.addChild(s.sprite);
    s.onRemove = () => {
      starContainer.removeChild(s.sprite);
    };
  }
  s.sprite.y += s.vy;
  if (s.sprite.y > 260) {
    s.sprite.y -= 264;
  }
}
