# pixel-perfect-collider

Pixel perfect collision detector.

### Demo

[stars](https://abagames.github.io/pixel-perfect-collider/index.html?stars)

[![stars screenshot](https://abagames.github.io/pixel-perfect-collider/stars.gif)](https://abagames.github.io/pixel-perfect-collider/index.html?stars)

[thread](https://abagames.github.io/pixel-perfect-collider/index.html?thread)

[![stars screenshot](https://abagames.github.io/pixel-perfect-collider/thread.gif)](https://abagames.github.io/pixel-perfect-collider/index.html?tread)

### How to use

See the [sample code](https://github.com/abagames/pixel-perfect-collider/blob/master/src/samples/stars.ts).

Include [build/index.js](https://github.com/abagames/pixel-perfect-collider/blob/master/build/index.js) script,

```html
  <script src="https://unpkg.com/pixel-perfect-collider/build/index.js"></script>
```

or install from npm.

```
> npm i pixel-perfect-collider
```

```js
import * as ppc from "pixel-perfect-collider";
```

Create `ppc.Collider` instance with a image whose collision should be detected.

```js
this.image = new Image();
this.image.src = "star.png";
this.image.onload = () => {
  this.collider = new ppc.Collider(this.image);
};
```

Set the position of the collider with `Collider#setPos` function.

```js
this.collider.setPos(x, y);
```

Use `Collider#test` function to test a collision between two colliders.

```js
stars[0].collider.test(stars[1].collider);
```
