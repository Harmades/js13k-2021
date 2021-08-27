import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Enemy from "./enemy"
import * as Bullets from "./bullet"
import * as Platform from "./platform";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import AtlasMetadata from "../asset/atlas.json";
import { round } from "./math";

export type Sprite = keyof typeof AtlasMetadata.frames

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = Settings.width;
canvas.height = Settings.height;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const atlas = loadImage(Atlas);

const offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = 16;
offscreenCanvas.height = 16;
const offscreenContext = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;

export function drawRect(rectangle: Rectangle, color: string) {
    context.save();
    context.translate(0.5, 0.5);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.restore();
}

function loadImage(path: string): HTMLImageElement {
    const image = new Image(16, 16);
    image.src = path;
    return image;
}

export function draw(key: Sprite, vector: Vector, flip: boolean = false) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    context.save();
    context.translate(round(vector.x), round(vector.y));
    if (flip) {
        context.translate(16, 0);
        context.scale(-1, 1);
    }
    context.drawImage(atlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    context.restore();
}

export function drawPattern(key: Sprite, rectangle: Rectangle) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    offscreenContext.drawImage(atlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    const pattern = context.createPattern(offscreenCanvas, "repeat");
    context.save();
    context.translate(rectangle.x, rectangle.y);
    if (pattern == null) throw new Error("Error creating pattern");
    context.fillStyle = pattern;
    context.fillRect(0, 0, rectangle.width, rectangle.height);
    context.restore();
}

export function render() {
    context.clearRect(0, 0, Settings.width, Settings.height);
    Player.render();
    Bullets.render();
    Platform.render();
    Enemy.render();
}