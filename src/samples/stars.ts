import * as ppc from "../index";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let stars: Star[] = [];
let px = 0;
let py = 0;

window.onload = () => {
  canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
  for (let i = 0; i < 2; i++) {
    stars.push(new Star());
  }
  document.onmousemove = e => {
    onMove(e.pageX, e.pageY);
  };
  document.ontouchmove = e => {
    onMove(e.touches[0].pageX, e.touches[0].pageY);
  };
  update();
};

function onMove(x, y) {
  px = ((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * 256;
  py = ((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * 256;
}

class Star {
  image: HTMLImageElement;
  collider: ppc.Collider;

  constructor() {
    this.image = new Image();
    this.image.src = "star.png";
    this.image.onload = () => {
      this.collider = new ppc.Collider(this.image);
    };
  }

  draw(x, y) {
    x -= this.image.width / 2;
    y -= this.image.height / 2;
    if (this.collider != null) {
      this.collider.setPos(x, y);
    }
    context.drawImage(this.image, x, y);
  }
}

let isColliding = false;

function update() {
  requestAnimationFrame(update);
  context.fillStyle = isColliding ? "pink" : "white";
  context.fillRect(0, 0, 256, 256);
  stars[0].draw(px, py);
  stars[1].draw(128, 128);
  isColliding =
    stars[0].collider != null &&
    stars[1].collider != null &&
    stars[0].collider.test(stars[1].collider);
}
