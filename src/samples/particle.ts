import * as ppe from "particle-pattern-emitter";
import * as PIXI from "pixi.js";
import * as sga from "./simpleGameActor";

let particleContainer: PIXI.particles.ParticleContainer;
let particleTexture: PIXI.Texture;
const particleBaseSize = 16;

export function init(
  app: PIXI.Application,
  parent: PIXI.Container,
  padding: number
) {
  particleContainer = new PIXI.particles.ParticleContainer(
    1000,
    {
      scale: true,
      position: true,
      alpha: true
    },
    1000
  );
  particleContainer.x = particleContainer.y = padding;
  parent.addChild(particleContainer);
  const g = new PIXI.Graphics();
  g.beginFill(0xffffff);
  g.drawRect(0, 0, particleBaseSize, particleBaseSize);
  g.endFill();
  particleTexture = app.renderer.generateTexture(g);
  ppe.setOptions({
    scaleRatio: 2,
    isLimitingColors: true
  });
}

export function emit(
  patternName: string,
  x: number,
  y: number,
  angle = 0,
  emitOptions: ppe.EmitOptions = {}
) {
  ppe.emit(patternName, x, y, angle, emitOptions).forEach(ppe => {
    new sga.Actor(particle, ppe, pool);
  });
}

export function update() {
  ppe.update();
  pool.update();
}

export function removeAll() {
  pool.removeAll();
}

let pool = new sga.Pool();

interface Particle extends sga.Actor {
  pos: { x: number; y: number };
  sprite: PIXI.Sprite;
  scale: PIXI.Point;
}

function particle(p: Particle, ppe: ppe.Particle) {
  if (p.isSpawning) {
    p.pos = { x: 0, y: 0 };
    p.scale = new PIXI.Point();
    p.sprite = new PIXI.Sprite(particleTexture);
    p.sprite.anchor.x = p.sprite.anchor.y = 0.5;
    p.sprite.scale = p.scale;
    particleContainer.addChild(p.sprite);
  }
  if (!ppe.isAlive) {
    particleContainer.removeChild(p.sprite);
    p.remove();
    return;
  }
  p.sprite.x = ppe.pos.x;
  p.sprite.y = ppe.pos.y;
  p.sprite.tint =
    (Math.floor(ppe.color.r * 255) << 16) |
    (Math.floor(ppe.color.g * 255) << 8) |
    Math.floor(ppe.color.b * 255);
  p.scale.x = p.scale.y = ppe.size / particleBaseSize;
  p.sprite.scale = p.scale;
}
