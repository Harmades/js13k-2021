import Level from "../asset/lvl_test.json";
import IdMap from "../asset/idMap.json";
import { platforms } from "./platform";
import { enemies } from "./enemy";
import { zero } from "./vector";

export function load() {
    const layer = Level.layers[1];
    const data = layer.data;
    for (let i = 0; i < data.length; i++) {
        const id = data[i];
        const x = i % layer.width;
        const y = Math.floor(i / layer.width);
        if (id == 19 || id == 18) {
            platforms.push({
                x: x * 16,
                y: y * 16,
                width: 16,
                height: 16,
                collision: false,
                inner: id == 19
            });
        }
        if (id == 7 || id == 8 || id == 9) {
            enemies.push({
                x: x * 16,
                y: y * 16,
                width: 16,
                height: 16,
                flipped: false,
                patrol: [],
                speed: zero(),
                state: "idle",
                type: id == 7 ? "human" : id == 8 ? "butcher" : "shield"
            })
        }
    }
}