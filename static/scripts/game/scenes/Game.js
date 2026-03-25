import Helper from '../util/Helper.js';
import Debug from '../util/Debug.js';

import Player from '../player/Player.js';
import DonutGold from '../objects/DonutGold.js';
import DonutMain from '../objects/DonutMain.js';
import ShopPanel from '../objects/ShopPanel.js';
import ShopItem from '../objects/ShopItem.js';
import Upgrade from '../objects/Upgrade.js';

import ASSETS from '../assets.js';

import Operator from '../enums/Operator.js';

export class Game extends Phaser.Scene
{
    constructor() { super('Game'); }

    create () {
        Helper.scene = this;
        Debug.init(this);

        this.initVariables();
        this.initPlayer();

        this.background = this.add.rectangle(this.centreX, this.centreY, this.scale.width, this.scale.height, 0xcdeddd);
        this.background.setDepth(-1000);

        this.shop.addItem('haemolacria', new ShopItem(this, 'haemolacria', "CP + 4", 999000, ASSETS.image.itemIcon.key, this.printo, new Upgrade(1, () => {
            Player.alterClickPower(Operator.Add, 4);
        })));
        this.shop.addItem('hemo', new ShopItem(this, 'haemolacria', "CP * 4", 500, ASSETS.image.itemIcon.key, this.printo, new Upgrade(2, () => {
            Player.alterClickPower(Operator.Mult, 10);
        })));
        this.shop.addItem('hamo', new ShopItem(this, 'haemolacria', "DPS + 10", 1, ASSETS.image.itemIcon.key, this.printo, new Upgrade(3, () => {
            Player.alterDPS(Operator.Add, 10);
        })));
    }

    update (time, delta) {
        const dT = delta / 1000;

        this.updateDonutsTimer += dT;

        if (this.updateDonutsTimer >= 10) {
            this.updateDonutsTimer -= 10;
            this.updateDatabase();
        }
        

        Player.update(dT);
        Debug.update();
    }

    initVariables () {
        this.updateDonutsTimer = 0;

        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;

        this.donut = new DonutMain(this);
        this.shop = new ShopPanel(this);
    }

    initPlayer () {
        Player.setupPlayer(this);
    }

    printo() {
        console.log('printo');
    }

    updateDatabase() {
        fetch(updateDonutsUrl+`?donuts=${encodeURIComponent(Player.getTotalDonuts())}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.#getCSRFToken()
            }
        });
    }

    #getCSRFToken() {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            .split('=')[1];
    }
}
