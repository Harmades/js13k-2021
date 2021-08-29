import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Bullet = Rectangle & { currentLifetime: number, alongVector: Vector }

export let bullets: Bullet[] = [];

const sprite = "bullet.png";
const spriteHeight = 6;
const spriteWidth = 8;

export function spawn(position: Vector, alongVector: Vector) {
    bullets.push({
        x: position.x,
        y: position.y,
        h: spriteHeight,
        w: spriteWidth,
        currentLifetime: 0,
        alongVector: alongVector
    });
}

export function render() {
    for (const bullet of bullets) {
        draw(sprite, bullet);
    }
}

export function bulletCollide(bullet: Bullet) {
    bullet.currentLifetime = Settings.bulletLifetime;
}

export function update(delta: number) {
    for (const bullet of bullets) {
        bullet.x += Settings.bulletSpeedX * bullet.alongVector.x * delta;
        bullet.currentLifetime++;
    }

    bullets = bullets.filter(b => b.currentLifetime <= Settings.bulletLifetime);
}