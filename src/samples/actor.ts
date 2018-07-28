import * as ppc from "..";
import * as screen from "./screen";
import * as sga from "./simpleGameActor";

let textures = {};
const removePaddingRatio = 0.25;

export function update() {
  sga.pool.update();
}

export class Actor extends sga.Actor {
  pos = { x: 0, y: 0 };
  size = { x: 0, y: 0 };
  sprite: PIXI.Sprite;
  collider: ppc.Collider;
  colliders: { [key: string]: ppc.Collider } = {};

  setImage(image: HTMLImageElement, name: string, isAddingCollider = true) {
    let texture;
    if (textures[name] != null) {
      texture = textures[name];
    } else {
      texture = PIXI.Texture.fromLoader(image, name);
      textures[name] = texture;
    }
    this.setTextureToSprite(texture);
    this.size.x = image.width;
    this.size.y = image.height;
    if (isAddingCollider) {
      const c = this.colliders[name];
      if (c != null) {
        this.collider = c;
      } else {
        this.collider = new ppc.Collider(image);
        this.collider.setAnchor(0.5, 0.5);
        this.colliders[name] = this.collider;
      }
    }
    this.onRemove = () => {
      if (this.sprite != null) {
        screen.container.removeChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
      }
    };
  }

  setGraphics(g: PIXI.Graphics, app: PIXI.Application) {
    let texture = app.renderer.generateTexture(g);
    this.setTextureToSprite(texture);
  }

  setTextureToSprite(texture: PIXI.Texture) {
    if (this.sprite == null) {
      this.sprite = new PIXI.Sprite(texture);
      this.sprite.anchor.x = 0.5;
      this.sprite.anchor.y = 0.5;
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
      screen.container.addChild(this.sprite);
    } else {
      this.sprite.texture = texture;
    }
  }

  update() {
    super.update();
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
}
