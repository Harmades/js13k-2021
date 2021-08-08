import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import { Vector } from "./vector";
import * as Player from "./player"

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = Settings.width;
canvas.height = Settings.height;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const atlas = new Image(96, 96);
atlas.src = "asset/atlas.png";

export function drawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
    context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function drawRect(rectangle: Rectangle) {
    context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}

export function drawAtlas(source: Vector, destination: Vector) {
    if (!atlas.complete) return;
    return drawImage(atlas, source.x, source.y, Settings.tileSize, Settings.tileSize, destination.x, destination.y, Settings.tileSize, Settings.tileSize);
}

export function render() {
    context.clearRect(0, 0, Settings.width, Settings.height);
    Player.render();
}