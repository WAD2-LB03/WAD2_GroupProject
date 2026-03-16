import Helper from '../util/Helper.js';

import BuyButton from './BuyButton.js';

import Player from '../player/Player.js';

export default class ShopItem extends Phaser.GameObjects.Sprite {
    constructor(scene, name, description, price, assetKey, buyAction = ()=>{}, upgrade) {
        super(scene, 0, 0, assetKey);

        this.scene = scene;
        this.scene.add.existing(this);

        this.setScale(2);
        this.setVisible(false);

        this.name = name;
        this.description = description;
        this.price = price;
        this.buyAction = buyAction;
        this.upgrade = upgrade;

        this.#initVariables();
        this.#initInteraction();
    }

    #initInteraction() {
        this.rectColl = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
        this.setInteractive(this.rectColl, Phaser.Geom.Rectangle.Contains);

        this.on('pointerover', (pointer) => {
            this.pointer = pointer;
            this.descText.setVisible(true);
            Player.addUpdate(this.name, this.update.bind(this));
        });
        this.on('pointerout', () => {
            this.hoverGraphics.clear();
            this.descText.setVisible(false);
            Player.removeUpdate(this.name);
        });
    }

    #initVariables() {
        this.container = this.scene.add.container(0, 0);

        this.nameText = this.scene.add.text(0, this.displayHeight * .5, this.name, { fontFamily: 'Silkscreen', fontSize: '8px', color: '0xffffff'});
        this.nameText.setVisible(false);
        this.nameText.setOrigin(.5, .5);

        this.hoverGraphics = this.scene.add.graphics();
        this.hoverBoxSize = new Phaser.Geom.Point(this.scene.scale.width * .2, this.scene.scale.height * .3);
        this.hoverGraphics.setDepth(100);

        this.descText = this.scene.add.text(0, 0, this.description, {fontFamily: 'Silkscreen', fontSize: '24px', color: '0xffffff'});
        this.descText.setDepth(101);
        this.descText.setVisible(false);
        this.descTextOffset = this.scene.scale.width * .01;

        this.buyButton = new BuyButton(this.scene, this.onPurchaseClicked.bind(this));
        this.buyButton.setVisible(false);
        this.priceText = this.scene.add.text(this.displayWidth * -.14, this.displayHeight * .83, Helper.abbreviateNum(this.price), { fontFamily: 'Silkscreen', fontSize: '8px', color: '0xffffff'});
        this.priceText.setVisible(false);
        this.priceText.setOrigin(0, .5);
        this.priceText.setScale(1.3);
        this.priceText.setLetterSpacing(-1);

        this.container.add(this);
        this.container.add(this.nameText);
        this.container.add(this.buyButton);
        this.container.add(this.priceText);
    }

    update(dT = 0) {
        this.hoverGraphics.clear();
        this.hoverGraphics.lineStyle(2, 0x000000, 1);
        this.hoverGraphics.fillStyle(0xffffff, .8);

        this.hoverGraphics.fillRect(
            this.pointer.x,
            this.pointer.y,
            this.hoverBoxSize.x,
            this.hoverBoxSize.y
        );
        this.hoverGraphics.strokeRect(
            this.pointer.x,
            this.pointer.y,
            this.hoverBoxSize.x,
            this.hoverBoxSize.y
        );

        this.descText.setPosition(this.pointer.x + this.descTextOffset, this.pointer.y + this.descTextOffset);
    }

    getText() {
        return this.nameText;
    }

    getBuyButton() {
        return this.buyButton;
    }

    spawn(x, y) {
        this.container.setPosition(x, y);

        this.setVisible(true);
        this.nameText.setVisible(true);
        this.buyButton.setVisible(true);
        this.priceText.setVisible(true);
    }

    despawn() {
        this.setVisible(false);
        this.nameText.setVisible(false);
        this.buyButton.setVisible(false);
        this.priceText.setVisible(true);
    }

    onPurchaseClicked() {
        if (Player.canAfford(this.price)) {
            this.buyAction();

            Player.upgradePurchased(this.upgrade, this.price);
        }
    }
}