import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Enemy from "./enemy"
import * as Bullet from "./bullet"
import * as Platform from "./platform";
import * as Background from "./background";
import * as Camera from "./camera";
import * as Cow from "./cow";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import AtlasMetadata from "../asset/atlas.json";
import { floor, round } from "./math";

export type Sprite = keyof typeof AtlasMetadata.frames

const cameraCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
cameraCanvas.width = Settings.cameraWidth;
cameraCanvas.height = Settings.cameraHeight;
const cameraContext = cameraCanvas.getContext("2d") as CanvasRenderingContext2D;

const staticCanvas = document.createElement("canvas") as HTMLCanvasElement;
staticCanvas.width = Settings.width;
staticCanvas.height = Settings.height;
const staticContext = staticCanvas.getContext("2d") as CanvasRenderingContext2D;

const playerCanvas = document.createElement("canvas") as HTMLCanvasElement;
playerCanvas.width = Settings.width;
playerCanvas.height = Settings.height;
const playerContext = playerCanvas.getContext("2d") as CanvasRenderingContext2D;

const atlasCanvas = document.createElement("canvas") as HTMLCanvasElement;
atlasCanvas.width = Settings.width;
atlasCanvas.height = Settings.height;
const atlasContext = atlasCanvas.getContext("2d") as CanvasRenderingContext2D;

let destinationContext = cameraContext;
let sourceContext = atlasContext;

const atlas = loadImage(Atlas);

const offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = 16;
offscreenCanvas.height = 16;
const offscreenContext = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;

export function drawRect(rectangle: Rectangle, color: string) {
    destinationContext.save();
    destinationContext.translate(0.5, 0.5);
    destinationContext.lineWidth = 1;
    destinationContext.strokeStyle = color;
    destinationContext.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    destinationContext.restore();
}

function loadImage(path: string): HTMLImageElement {
    const image = new Image(16, 16);
    image.src = path;
    image.onload = () => {
        atlasRender();
        staticRender();
    }
    return image;
}

export function draw(key: Sprite, vector: Vector, flip: boolean = false) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    destinationContext.save();
    destinationContext.translate(round(vector.x), round(vector.y));
    if (flip) {
        destinationContext.translate(16, 0);
        destinationContext.scale(-1, 1);
    }
    destinationContext.drawImage(sourceContext.canvas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    destinationContext.restore();
}

export function drawPattern(key: Sprite, rectangle: Rectangle) {
    if (!atlas.complete) return;
    const frame = AtlasMetadata.frames[key].frame;
    offscreenContext.drawImage(atlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
    const pattern = destinationContext.createPattern(offscreenCanvas, "repeat");
    destinationContext.save();
    destinationContext.translate(rectangle.x, rectangle.y);
    if (pattern == null) throw new Error("Error creating pattern");
    destinationContext.fillStyle = pattern;
    destinationContext.fillRect(0, 0, rectangle.width, rectangle.height);
    destinationContext.restore();
}

export function cameraRender(camera: Camera.Camera) {
    const cx = floor(camera.x);
    const cy = round(camera.y);
    destinationContext.drawImage(staticCanvas, cx, cy, camera.width, camera.height, 0, 0, camera.width, camera.height);
    destinationContext.drawImage(playerCanvas, cx, cy, camera.width, camera.height, 0, 0, camera.width, camera.height);
}

export function render() {
    sourceContext = atlasContext;
    destinationContext = playerContext;
    destinationContext.clearRect(0, 0, Settings.width, Settings.height);
    Bullet.render();
    Enemy.render();
    Player.render();
    Cow.render();
    sourceContext = playerContext;
    destinationContext = cameraContext;
    destinationContext.clearRect(0, 0, Settings.width, Settings.height);
    Camera.render();
}

export function staticRender() {
    destinationContext = staticContext;
    sourceContext = atlasContext;
    Background.render();
    Platform.render();
}

function atlasRender() {
    destinationContext = atlasContext;
    destinationContext.drawImage(atlas, 0, 0);
}