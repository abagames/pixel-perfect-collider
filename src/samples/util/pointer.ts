import Vector from "./vector";

export let pos: Vector;
export let move: Vector;
export let pressedPos: Vector;
export let targetPos: Vector;
export let isPressed = false;
export let isJustPressed = false;

let cursorPos: Vector;
let isDown = false;
let screen: HTMLElement;
let pixelSize: Vector;
let isInitialized = false;
let padding: Vector;
let prevPos: Vector;
let isResettingTargetPos = false;

export function init(
  _screen: HTMLElement,
  _pixelSize: Vector,
  _padding: Vector = new Vector(),
  onTouchStart: Function = null
) {
  screen = _screen;
  pixelSize = new Vector(
    _pixelSize.x + _padding.x * 2,
    _pixelSize.y + _padding.y * 2
  );
  padding = _padding;
  document.addEventListener("mousedown", e => {
    onDown(e.pageX, e.pageY);
  });
  document.addEventListener("touchstart", e => {
    if (onTouchStart != null) {
      onTouchStart();
    }
    onDown(e.touches[0].pageX, e.touches[0].pageY);
  });
  document.addEventListener("mousemove", e => {
    onMove(e.pageX, e.pageY);
  });
  document.addEventListener(
    "touchmove",
    e => {
      e.preventDefault();
      onMove(e.touches[0].pageX, e.touches[0].pageY);
    },
    { passive: false }
  );
  document.addEventListener("mouseup", e => {
    onUp(e);
  });
  document.addEventListener(
    "touchend",
    e => {
      e.preventDefault();
      (e.target as any).click();
      onUp(e);
    },
    { passive: false }
  );
  pos = new Vector();
  move = new Vector();
  pressedPos = new Vector();
  prevPos = new Vector();
  targetPos = new Vector();
  cursorPos = new Vector();
  isInitialized = true;
}

export function update() {
  if (!isInitialized) {
    return;
  }
  const pp = isPressed;
  isPressed = isDown;
  isJustPressed = !pp && isPressed;
  calcPointerPos(cursorPos.x, cursorPos.y, pos);
  if (isJustPressed) {
    pressedPos.set(pos);
    prevPos.set(pos);
  }
  move.set(pos.x - prevPos.x, pos.y - prevPos.y);
  prevPos.set(pos);
  if (isResettingTargetPos) {
    targetPos.set(pos);
    isResettingTargetPos = false;
  } else {
    targetPos.add(move);
  }
}

export function clearJustPressed() {
  isJustPressed = false;
  isPressed = true;
}

export function resetPressedPointerPos(ratio = 1) {
  pressedPos.x += (pos.x - pressedPos.x) * ratio;
  pressedPos.y += (pos.y - pressedPos.y) * ratio;
}

export function setTargetPos(v: Vector) {
  targetPos.set(v);
}

function calcPointerPos(x, y, v) {
  v.x =
    ((x - screen.offsetLeft) / screen.clientWidth + 0.5) * pixelSize.x -
    padding.x;
  v.y =
    ((y - screen.offsetTop) / screen.clientHeight + 0.5) * pixelSize.y -
    padding.y;
}

function onDown(x, y) {
  cursorPos.set(x, y);
  isDown = true;
}

function onMove(x, y) {
  cursorPos.set(x, y);
  if (!isDown) {
    isResettingTargetPos = true;
  }
}

function onUp(e) {
  isDown = false;
}
