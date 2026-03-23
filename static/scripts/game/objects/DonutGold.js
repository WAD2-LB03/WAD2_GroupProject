import ASSETS from '../assets.js';

import Donut from './Donut.js';

export default class DonutGold extends Donut {
    constructor(scene) {
        super(scene, 6, ASSETS.image.goldenDonut);
    }

    onClick() {
        console.log("sksksksks");
    }
}