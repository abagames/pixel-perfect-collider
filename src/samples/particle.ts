import * as ppe from "particle-pattern-emitter";
import * as PIXI from "pixi.js";

let particles: Particle[] = [];
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
}

export function emit(
  patternName: string,
  x: number,
  y: number,
  angle = 0,
  emitOptions: ppe.EmitOptions = {}
) {
  ppe.emit(patternName, x, y, angle, emitOptions).forEach(p => {
    particles.push(new Particle(p));
  });
}

export function update() {
  ppe.update();
  for (let i = 0; i < particles.length; ) {
    if (particles[i].update() === false) {
      particles.splice(i, 1);
    } else {
      i++;
    }
  }
}

export function removeAll() {
  particles.forEach(p => {
    p.remove();
  });
  particles = [];
}

class Particle {
  pos = { x: 0, y: 0 };
  sprite: PIXI.Sprite;
  baseSize = 16;
  scale = new PIXI.Point();

  constructor(public ppeParticle: ppe.Particle) {
    this.sprite = new PIXI.Sprite(particleTexture);
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.sprite.scale = this.scale;
    particleContainer.addChild(this.sprite);
  }

  update() {
    if (!this.ppeParticle.isAlive) {
      this.remove();
      return false;
    }
    const p = this.ppeParticle;
    this.sprite.x = p.pos.x;
    this.sprite.y = p.pos.y;
    this.sprite.tint =
      (Math.floor(p.color.r * 255) << 16) |
      (Math.floor(p.color.g * 255) << 8) |
      Math.floor(p.color.b * 255);
    this.scale.x = this.scale.y = p.size / this.baseSize;
    this.sprite.scale = this.scale;
  }

  remove() {
    particleContainer.removeChild(this.sprite);
  }
}
