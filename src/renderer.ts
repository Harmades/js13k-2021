import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Enemy from "./enemy"
import * as Bullet from "./bullet"
import * as Platform from "./platform";
import * as Background from "./background";
import * as Camera from "./camera";
import * as Cow from "./cow";
import * as Ui from "./ui";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import { createElement, floor, getElementById, round } from "./alias";

const [cameraCanvas, cameraContext] = createCanvas(Settings.cameraWidth, Settings.cameraHeight, "gameCanvas");
const [staticCanvas, staticContext] = createCanvas(Settings.width, Settings.height);
const [backgroundCanvas, backgroundContext] = createCanvas(Settings.width, Settings.height);
const [playerCanvas, playerContext] = createCanvas(Settings.width, Settings.height);
const [atlasCanvas, atlasContext] = createCanvas(Settings.width, Settings.height);
const [offscreenCanvas, offscreenContext] = createCanvas(Settings.tileSize, Settings.tileSize);
const atlas = loadImage(Atlas);

let destinationContext = cameraContext;
let sourceContext = atlasContext;

function createCanvas(w: number, h: number, id: string | null = null): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = (id == null ? createElement("canvas") : getElementById(id)) as HTMLCanvasElement;
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    return [canvas, context];
}

export function drawRect(rectangle: Rectangle, color: string) {
    destinationContext.fillStyle = color;
    destinationContext.fillRect(round(rectangle.x), round(rectangle.y), rectangle.w, rectangle.h);
    // destinationContext.save();
    // destinationContext.translate(0.5, 0.5);
    // destinationContext.lineWidth = 1;
    // destinationContext.strokeStyle = color;
    // destinationContext.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    // destinationContext.restore();
}

function loadImage(path: string): HTMLImageElement {
    const image = new Image(Settings.tileSize, Settings.tileSize);
    image.src = path;
    image.onload = () => {
        atlasRender();
        staticRender();
    }
    return image;
}

export function draw(atlasPosition: Vector, vector: Vector, flip: boolean = false, width: number = Settings.tileSize, height: number = Settings.tileSize, alpha: number = 1) {
    if (!atlas.complete) return;
    destinationContext.save();
    destinationContext.globalAlpha = alpha;
    destinationContext.translate(round(vector.x), round(vector.y));
    if (flip) {
        destinationContext.translate(Settings.tileSize, 0);
        destinationContext.scale(-1, 1);
    }
    destinationContext.drawImage(sourceContext.canvas, atlasPosition.x, atlasPosition.y, width, height, 0, 0, width, height);
    destinationContext.restore();
}

export function drawPattern(atlasPosition: Vector, destination: Rectangle) {
    if (!atlas.complete) return;
    offscreenContext.drawImage(atlas, atlasPosition.x, atlasPosition.y, Settings.tileSize, Settings.tileSize, 0, 0, Settings.tileSize, Settings.tileSize);
    const pattern = destinationContext.createPattern(offscreenCanvas, "repeat");
    destinationContext.save();
    destinationContext.translate(destination.x, destination.y);
    if (pattern == null) throw new Error();
    destinationContext.fillStyle = pattern;
    destinationContext.fillRect(0, 0, destination.w, destination.h);
    destinationContext.restore();
}

export function drawText(text: string) {
    cameraContext.font = "12px serif";
    cameraContext.fillText(text, 190, 20);
}

export function cameraRender(camera: Camera.Camera) {
    const cx = floor(camera.x);
    const cy = round(camera.y);
    destinationContext.drawImage(backgroundCanvas, round(cx * 0.4), round(cy * 0.4), camera.w, camera.h, 0, 0, camera.w, camera.h);
    destinationContext.drawImage(staticCanvas, cx, cy, camera.w, camera.h, 0, 0, camera.w, camera.h);
    destinationContext.drawImage(playerCanvas, cx, cy, camera.w, camera.h, 0, 0, camera.w, camera.h);
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
    Ui.render();
}

export function staticRender() {
    destinationContext = backgroundContext;
    sourceContext = atlasContext;
    Background.render();
    destinationContext = staticContext;
    Platform.render();
}

function atlasRender() {
    destinationContext = atlasContext;
    destinationContext.drawImage(atlas, 0, 0);
}
