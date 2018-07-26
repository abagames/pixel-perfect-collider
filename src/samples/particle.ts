import * as ppe from "particle-pattern-emitter";
import * as PIXI from "pixi.js";
import * as sa from "./simpleActor";

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
  ppe.setOptions({ isLimitingColors: true });
}

export function emit(
  patternName: string,
  x: number,
  y: number,
  angle = 0,
  emitOptions: ppe.EmitOptions = {}
) {
  ppe.emit(patternName, x, y, angle, emitOptions).forEach(ppe => {
    new Particle(particle, ppe);
  });
}

export function update() {
  ppe.update();
  _pool.update();
}

export function removeAll() {
  _pool.removeAll();
}

let _pool = new sa.SimpleActorPool();

class Particle extends sa.SimpleActor {
  pos = { x: 0, y: 0 };
  sprite: PIXI.Sprite;
  baseSize = 16;
  scale = new PIXI.Point();
  pool = _pool;
  isSpawning = true;
}

function particle(p: Particle, ppe: ppe.Particle) {
  if (p.isSpawning) {
    p.isSpawning = false;
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
  p.scale.x = p.scale.y = ppe.size / p.baseSize;
  p.sprite.scale = p.scale;
}
