import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import { Vector } from "./vector";
import * as Player from "./player"
import * as Platform from "./platform";
import Atlas from '../asset/atlas.png';

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = Settings.width;
canvas.height = Settings.height;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const atlas = new Image(96, 96);
atlas.src = Atlas;

export function drawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
    context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function drawRect(rectangle: Rectangle, color: string) {
    context.save();
    context.translate(0.5, 0.5);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.restore();
}

export function drawAtlas(source: Vector, destination: Vector) {
    if (!atlas.complete) return;
    return drawImage(atlas, source.x, source.y, Settings.tileSize, Settings.tileSize, Math.round(destination.x), Math.round(destination.y), Settings.tileSize, Settings.tileSize);
}

export function render() {
    context.clearRect(0, 0, Settings.width, Settings.height);
    Player.render();
    Platform.render();
}