import * as screen from "./screen";
import * as ppc from "../index";

let actors: Actor[] = [];
let textures = {};
const removePaddingRatio = 0.25;

export function update() {
  for (let i = 0; i < actors.length; ) {
    const a = actors[i];
    if (a.isAlive) {
      a.update();
    }
    if (!a.isAlive) {
      actors.splice(i, 1);
    } else {
      i++;
    }
  }
}

export function get(name: string = null) {
  return name == null ? actors : actors.filter(a => a.name === name);
}

export function removeAll() {
  actors.forEach(a => {
    a.remove();
  });
  actors = [];
}

export class Actor {
  pos = { x: 0, y: 0 };
  size = { x: 0, y: 0 };
  sprite: PIXI.Sprite;
  collider: ppc.Collider;
  colliders: { [key: string]: ppc.Collider } = {};
  name;
  isAlive = true;

  constructor() {
    actors.push(this);
  }

  setImage(image: HTMLImageElement, name: string, isAddingCollider = true) {
    let texture;
    if (textures[name] != null) {
      texture = textures[name];
    } else {
      texture = PIXI.Texture.fromLoader(image, name);
      textures[name] = texture;
    }
    if (this.sprite == null) {
      this.sprite = new PIXI.Sprite(texture);
      this.sprite.anchor.x = 0.5;
      this.sprite.anchor.y = 0.5;
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
      screen.screen.addChild(this.sprite);
    } else {
      this.sprite.texture = texture;
    }
    this.size.x = image.width;
    this.size.y = image.height;
    if (isAddingCollider) {
      const c = this.colliders[name];
      if (c != null) {
        this.collider = c;
      } else {
        this.collider = new ppc.Collider(image);
        this.collider.anchor.x = this.collider.anchor.y = 0.5;
        this.colliders[name] = this.collider;
      }
    }
  }

  update() {
    if (this.sprite != null) {
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
    }
    if (this.collider != null) {
      this.collider.setPos(this.pos.x, this.pos.y);
    }
    if (
      this.pos.x < -screen.size * removePaddingRatio ||
      this.pos.x > screen.size * (1 + removePaddingRatio) ||
      this.pos.y < -screen.size * removePaddingRatio ||
      this.pos.y > screen.size * (1 + removePaddingRatio)
    ) {
      this.remove();
    }
  }

  remove() {
    if (!this.isAlive) {
      return;
    }
    this.isAlive = false;
    if (this.sprite != null) {
      screen.screen.removeChild(this.sprite);
    }
  }
}
