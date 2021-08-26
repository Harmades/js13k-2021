import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Platform from "./platform";
import { Vector } from "./vector";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = Settings.width;
canvas.height = Settings.height;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

export function drawRect(rectangle: Rectangle, color: string) {
    context.save();
    context.translate(0.5, 0.5);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.restore();
}

export function loadImage(path: string): HTMLImageElement {
    const image = new Image(16, 16);
    image.src = path;
    return image;
}

export function drawImage(image: HTMLImageElement, vector: Vector) {
    if (!image.complete) return;
    context.drawImage(image, Math.round(vector.x), Math.round(vector.y));
}

export function drawImagePattern(image: HTMLImageElement, rectangle: Rectangle) {
    const pattern = context.createPattern(image, "repeat");
    if (pattern == null) throw new Error("Error creating pattern");
    context.fillStyle = pattern;
    context.fillRect(Math.round(rectangle.x), Math.round(rectangle.y), rectangle.width, rectangle.height);
}

export function render() {
    context.clearRect(0, 0, Settings.width, Settings.height);
    Player.render();
    Platform.render();
}