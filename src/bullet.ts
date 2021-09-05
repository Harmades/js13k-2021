import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Bullet = Rectangle & { currentLifetime: number, alongVector: Vector }

export let bullets: Bullet[] = [];

const sprite = {
    x: 4 * Settings.tileSize + 4,
    y: 0 * Settings.tileSize + 5,
    w: 8,
    h: 6
};


export function spawn(position: Vector, alongVector: Vector) {
    bullets.push({
        ...sprite,
        ...position,
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