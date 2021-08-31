import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Bullet = Rectangle & { currentLifetime: number, alongVector: Vector }

export let bullets: Bullet[] = [];

const h = 6;
const w = 8;

const sprite = {
    x: 4 * Settings.tileSize,
    y: 0 + Settings.tileSize - h
};


export function spawn(position: Vector, alongVector: Vector) {
    bullets.push({
        x: position.x,
        y: position.y,
        h: h,
        w: w,
        currentLifetime: 0,
        alongVector: alongVector
    });
}

export function render() {
    for (const bullet of bullets) {
        draw(sprite, bullet, false, w, h);
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