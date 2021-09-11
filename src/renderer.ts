import { Rectangle } from "./rectangle";
import { Settings } from "./settings";
import * as Player from "./player"
import * as Enemy from "./enemy"
import * as Bullet from "./bullet"
import * as Tile from "./tile";
import * as Background from "./background";
import * as Camera from "./camera";
import * as Cow from "./cow";
import * as Ui from "./ui";
import * as MovingTile from "./dynamicTile";
import * as Lava from "./lava";
import { Vector } from "./vector";
import Atlas from "../asset/atlas.png";
import { createElement, getElementById, PI, round, sign } from "./alias";

export type Sprite = {
    x: number;
    y: number;
    w?: number;
    ow?: number;
    h?: number;
    hFlip?: boolean;
    vFlip?: boolean;
    dFlip?: boolean;
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

export function drawRectOutline({ x, y, w = 1, h = 1, color = "" }: Sprite) {
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

export function draw({ x, y, w = Settings.tileSize, ow = 0, h = Settings.tileSize, hFlip: hFlip = false, vFlip = false, dFlip = false, alpha = 1 }: Sprite, vector: Vector) {
    if (!atlas.complete) return;
    destinationContext.save();
    destinationContext.globalAlpha = alpha;
    destinationContext.translate(round(vector.x), round(vector.y));
    if (hFlip) {
        destinationContext.translate(Settings.tileSize + ow, 0);
        destinationContext.scale(-1, 1);
    }
    if (vFlip) {
        destinationContext.translate(0, Settings.tileSize);
        destinationContext.scale(1, -1);
    }
    if (dFlip) {
        if (vFlip) {
            destinationContext.scale(1, -1);
            destinationContext.rotate(-PI / 2);
        } else if (hFlip) {
            destinationContext.scale(-1, 1);
            destinationContext.rotate(PI / 2);
        } else {
            destinationContext.translate(w, 0);
            destinationContext.rotate(PI / 2);
        }
    }
    
    destinationContext.drawImage(sourceContext.canvas, x, y, w, h, 0, 0, w, h);
    destinationContext.restore();
}

export function drawPattern({ x: sx, y: sy }: Sprite, { x: dx, y: dy, w, h }: Rectangle) {
    if (!atlas.complete) return;
    offscreenContext.drawImage(atlas, sx, sy, Settings.tileSize, Settings.tileSize, 0, 0, Settings.tileSize, Settings.tileSize);
    const pattern = destinationContext.createPattern(offscreenContext.canvas, "repeat");
    destinationContext.save();
    destinationContext.translate(round(dx), round(dy));
    if (pattern == null) throw new Error();
    destinationContext.fillStyle = pattern;
    destinationContext.fillRect(0, 0, w, h);
    destinationContext.restore();
}

export function drawText(text: string, size: number, { x, y }: Vector, color = "#FFFFEB") {
    cameraContext.font = `${size}px sans-serif`;
    cameraContext.fillStyle = color;
    cameraContext.fillText(text, x, y);
}

export function cameraRender({ x, y, w, h, ox, oy, colorized }: Camera.Camera) {
    if (!colorized) {
        destinationContext.save();
    }
    const cx = round(x) + ox;
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
    MovingTile.render();
    Lava.render();
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
    Tile.render();
}

function atlasRender() {
    destinationContext = atlasContext;
    destinationContext.drawImage(atlas, 0, 0);
}

export function spriteEquals(s1: Sprite, s2: Sprite) { return s1.x == s2.x && s1.y && s2.y; }