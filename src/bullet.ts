import { Rectangle } from "./rectangle";
import Bullet from "../asset/other/bullet.png";
import { drawImage, loadImage } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Bullet = Rectangle & { currentLifetime: number, alongVector: Vector }

let bullets: Bullet[] = [];

const sprite = loadImage(Bullet);
const spriteHeight = 6;
const spriteWidth = 8;

export function spawn(position: Vector, alongVector: Vector) {
    bullets.push({
        x: position.x,
        y: position.y,
        height: spriteHeight,
        width: spriteWidth,
        currentLifetime: 0,
        alongVector: alongVector
    });
}

export function render() {
    for (const bullet of bullets) {
        drawImage(sprite, bullet);
    }
}

export function update(delta: number) {
    for (const bullet of bullets) {
        bullet.x += Settings.bulletSpeedX * bullet.alongVector.x * delta;
        bullet.currentLifetime++;
    }

    bullets = bullets.filter(b => b.currentLifetime <= Settings.bulletLifetime);
}