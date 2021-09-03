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
import * as Light from "./light";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import { createElement, floor, getElementById, round, sign } from "./alias";

export type Sprite = {
    x: number;
    y: number;
    w?: number;
    h?: number;
    flip?: boolean;
    alpha?: number;
    color?: string;
    colorized?: boolean;
}

const cameraContext = createCanvas(Settings.cameraWidth, Settings.cameraHeight, "gameCanvas");
const staticContext = createCanvas(Settings.width, Settings.height);
const backgroundContext = createCanvas(Settings.width, Settings.height);
const playerContext = createCanvas(Settings.width, Settings.height);
const atlasContext = createCanvas(Settings.width, Settings.height);
const offscreenContext = createCanvas(Settings.tileSize, Settings.tileSize);
const atlas = loadImage(Atlas);

let destinationContext = cameraContext;
let sourceContext = atlasContext;

function createCanvas(w: number, h: number, id: string | null = null) {
    const canvas = (id == null ? createElement("canvas") : getElementById(id)) as HTMLCanvasElement;
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    return context;
}

export function drawRect({ x, y, w = 1, h = 1, color = "#FFFFFF" }: Sprite) {
    destinationContext.fillStyle = color;
    destinationContext.fillRect(round(x), round(y), w, h);
}

export function drawRectOutline({ x, y, w, h }: Rectangle, color: string) {
    destinationContext.save();
    destinationContext.translate(0.5, 0.5);
    destinationContext.lineWidth = 1;
    destinationContext.strokeStyle = color;
    destinationContext.strokeRect(x, y, w, h);
    destinationContext.restore();
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

export function draw({ x, y, w = 16, h = 16, flip = false, alpha = 1 }: Sprite, vector: Vector) {
    if (!atlas.complete) return;
    destinationContext.save();
    destinationContext.globalAlpha = alpha;
    destinationContext.translate(round(vector.x), round(vector.y));
    if (flip) {
        destinationContext.translate(Settings.tileSize, 0);
        destinationContext.scale(-1, 1);
    }
    destinationContext.drawImage(sourceContext.canvas, x, y, w, h, 0, 0, w, h);
    destinationContext.restore();
}

export function drawGradientCircle({ x, y, color, radius, alpha, angle }: Light.Light) {
    destinationContext.save();
    destinationContext.globalAlpha = alpha;
    destinationContext.globalCompositeOperation = "lighter";
    const gradient = destinationContext.createRadialGradient(x, y, 1, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    destinationContext.beginPath();
    destinationContext.moveTo(x, y);
    destinationContext.closePath();
    destinationContext.arc(x, y, radius, 0, angle, sign(angle) == -1);
    destinationContext.fillStyle = gradient;
    destinationContext.fill();
    destinationContext.restore();
}

export function drawPattern({ x: sx, y: sy }: Sprite, { x: dx, y: dy, w, h }: Rectangle) {
    if (!atlas.complete) return;
    offscreenContext.drawImage(atlas, sx, sy, Settings.tileSize, Settings.tileSize, 0, 0, Settings.tileSize, Settings.tileSize);
    const pattern = destinationContext.createPattern(offscreenContext.canvas, "repeat");
    destinationContext.save();
    destinationContext.translate(dx, dy);
    if (pattern == null) throw new Error();
    destinationContext.fillStyle = pattern;
    destinationContext.fillRect(0, 0, w, h);
    destinationContext.restore();
}

export function drawText(text: string, { x, y }: Vector) {
    cameraContext.font = "12px sans-serif";
    cameraContext.fillStyle = "#FFFFEB";
    cameraContext.fillText(text, x, y);
}

export function cameraRender({ x, y, w, h, ox, oy, colorized }: Camera.Camera) {
    if (!colorized) {
        destinationContext.save();
    }
    const cx = floor(x) + ox;
    const cy = round(y) + oy;
    destinationContext.drawImage(backgroundContext.canvas, round(x * 0.4) + ox, round(y * 0.4) + oy, w, h, ox, oy, w, h);
    destinationContext.drawImage(staticContext.canvas, cx, cy, w, h, ox, oy, w, h);
    destinationContext.drawImage(playerContext.canvas, cx, cy, w, h, ox, oy, w, h);
    if (!colorized) {
        destinationContext.globalCompositeOperation = "color";
        destinationContext.fillStyle = "black";
        destinationContext.fillRect(ox, oy, w, h);        
        destinationContext.restore();
    }
}

export function render() {
    sourceContext = atlasContext;
    destinationContext = playerContext;
    destinationContext.clearRect(0, 0, Settings.width, Settings.height);
    Bullet.render();
    Enemy.render();
    Player.render();
    Cow.render();
    Light.render();
    sourceContext = playerContext;
    destinationContext = cameraContext;
    destinationContext.clearRect(0, 0, Settings.width, Settings.height);
    Camera.render();
    sourceContext = atlasContext;
    Ui.render();
}

export function staticRender() {
    destinationContext = backgroundContext;
    sourceContext = atlasContext;
    Background.render();
    destinationContext = staticContext;
    destinationContext.shadowOffsetX = 2;
    destinationContext.shadowOffsetY = 2;
    destinationContext.shadowColor = "rgba(0, 0, 0, 0.5)";
    Platform.render();
    Light.render();
}

function atlasRender() {
    destinationContext = atlasContext;
    destinationContext.drawImage(atlas, 0, 0);
}
