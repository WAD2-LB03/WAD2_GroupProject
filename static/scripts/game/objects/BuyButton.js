import Debug from '../util/Debug.js';

import ASSETS from '../assets.js';

export default class BuyButton extends Phaser.GameObjects.Sprite {
    constructor(scene, action) {
        super(scene, 0, 0, ASSETS.image.buyButton.key);

        this.setScale(1);
        this.setPosition(0, this.displayHeight * .8);
        this.setVisible(false);

        scene.add.existing(this);

        this.action = action;

        this.#initInteraction();

        if (Debug.active) {
            Debug.addDebugCollider(this, this.rectColl);
        }
    }

    #initInteraction() {
        this.rectColl = new Phaser.Geom.Rectangle(this.displayWidth * -.4, this.displayHeight * .21, this.displayWidth * 1.9, this.displayHeight * .8);
        this.setInteractive(this.rectColl, Phaser.Geom.Rectangle.Contains);

        this.on('pointerdown', this.action);
    }
}