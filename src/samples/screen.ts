import * as PIXI from "pixi.js";
import * as PIXIFilters from "pixi-filters";
import * as particle from "./particle";

export let app: PIXI.Application;
export let screen: PIXI.Container;
export let size: number;

export function init(
  _size = 256,
  padding = 24,
  backgroundColor = 0x111111,
  edgeColor = 0
) {
  size = _size;
  const appSize = size + padding * 2;
  app = new PIXI.Application({ width: appSize, height: appSize });
  app.view.setAttribute("id", "screen");
  document.body.appendChild(app.view);
  const filterContainer = new PIXI.Container();
  filterContainer.filterArea = new PIXI.Rectangle(0, 0, appSize, appSize);
  app.stage.addChild(filterContainer);
  const bloomFilter = new PIXIFilters.AdvancedBloomFilter({
    threshold: 0.1,
    bloomScale: 1,
    brightness: 1,
    blur: 5
  });
  filterContainer.filters = [bloomFilter];
  const backgroundContainer = new PIXI.Container();
  const background = new PIXI.Graphics();
  background.beginFill(backgroundColor);
  background.drawRect(padding, padding, size, size);
  background.endFill();
  backgroundContainer.addChild(background);
  filterContainer.addChild(backgroundContainer);
  particle.init(app, filterContainer, padding);
  screen = new PIXI.Container();
  screen.x = screen.y = padding;
  filterContainer.addChild(screen);
  const edgeContainer = new PIXI.Container();
  const edge = new PIXI.Graphics();
  edge.beginFill(edgeColor);
  edge.drawRect(0, 0, padding, appSize);
  edge.drawRect(appSize - padding, 0, padding, appSize);
  edge.drawRect(0, 0, appSize, padding);
  edge.drawRect(0, appSize - padding, appSize, padding);
  edge.endFill();
  edgeContainer.addChild(edge);
  filterContainer.addChild(edgeContainer);
}
