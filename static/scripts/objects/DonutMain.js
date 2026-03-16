import ASSETS from '../assets.js';

import Donut from './Donut.js';
import Player from '../player/Player.js';

export default class DonutMain extends Donut {
    constructor(scene) {
        super(scene, 6, ASSETS.image.donut);
    }

    onClick() {
        Player.donutClicked();
    }
}