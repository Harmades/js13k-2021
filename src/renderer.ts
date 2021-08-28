import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Enemy from "./enemy"
import * as Bullet from "./bullet"
import * as Platform from "./platform";
import * as Background from "./background";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import AtlasMetadata from "../asset/atlas.json";
import { round } from "./math";

export type Sprite = keyof typeof AtlasMetadata.frames

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = Settings.width;
canvas.height = Settings.height;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const staticCanvas = document.getElementById("staticCanvas") as HTMLCanvasElement;
staticCanvas.width = Settings.width;
staticCanvas.height = Settings.height;
const staticContext = staticCanvas.getContext("2d") as CanvasRenderingContext2D;

const backgroundCanvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement;
backgroundCanvas.width = Settings.width;
backgroundCanvas.height = Settings.height;
const backgroundContext = backgroundCanvas.getContext("2d") as CanvasRenderingContext2D;

let currentContext = context;

const atlas = loadImage(Atlas);

const offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = 16;
offscreenCanvas.height = 16;
const offscreenContext = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;

export function drawRect(rectangle: Rectangle, color: string) {
    currentContext.save();
    currentContext.translate(0.5, 0.5);
    currentContext.lineWidth = 1;
    currentContext.strokeStyle = color;
    currentContext.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    currentContext.restore();
}

function loadImage(path: string): HTMLImageElement {
    const image = new Image(16, 16);
    image.src = path;
    image.onload = () => staticRender();
    return image;
}

export function draw(key: Sprite, vector: Vector, flip: boolean = false) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    currentContext.save();
    currentContext.translate(round(vector.x), round(vector.y));
    if (flip) {
        currentContext.translate(16, 0);
        currentContext.scale(-1, 1);
    }
    currentContext.drawImage(atlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    currentContext.restore();
}

export function drawPattern(key: Sprite, rectangle: Rectangle) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    offscreenContext.drawImage(atlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    const pattern = currentContext.createPattern(offscreenCanvas, "repeat");
    currentContext.save();
    currentContext.translate(rectangle.x, rectangle.y);
    if (pattern == null) throw new Error("Error creating pattern");
    currentContext.fillStyle = pattern;
    currentContext.fillRect(0, 0, rectangle.width, rectangle.height);
    currentContext.restore();
}

export function render() {
    currentContext = context;
    currentContext.clearRect(0, 0, Settings.width, Settings.height);
    Player.render();
    Bullet.render();
    Enemy.render();
}

export function staticRender() {
    currentContext = backgroundContext;
    Background.render();
    currentContext = staticContext;
    Platform.render();
}