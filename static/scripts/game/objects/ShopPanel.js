import Debug from '../util/Debug.js';

import Input from '../player/Input.js';

import ASSETS from '../assets.js';

export default class ShopPanel extends Phaser.GameObjects.Sprite {
    static curScoreContainer;

    constructor(scene) {
        super(scene, 0, 0, ASSETS.image.shopClosed.key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.setScale(3);

        this.#initInteraction();
        this.#initVariables();
        this.#initAnims();

        if (Debug.active) {
            Debug.addDebugCollider(this, this.rectColl);
            this.#debugItemLocations();
        }
    }

    #initVariables() {
        this.defaultPos = new Phaser.Geom.Point(this.scene.scale.width - this.displayWidth * .5, this.scene.scale.height + this.displayHeight * .1);

        this.container = this.scene.add.container(this.defaultPos.x, this.defaultPos.y);
        this.itemContainer = this.scene.add.container(this.width * .35, this.height * .4).setScale(2);
        //this.textContainer = this.scene.add.container(0, this.height * .25);
        //this.buyButtonContainer = this.scene.add.container(0, this.height * .38);
        ShopPanel.curScoreContainer = this.scene.add.container(this.displayWidth * .28, this.displayHeight * -.35);

        this.container.add(this);
        this.container.add(this.itemContainer);
        this.container.add(ShopPanel.curScoreContainer);
        //this.itemContainer.add(this.textContainer);
        //this.itemContainer.add(this.buyButtonContainer);
        
        this.itemOffset = new Phaser.Geom.Point(this.displayWidth * .11, this.displayHeight * .25);
        this.shopItems = []; 
        
        this.defaultOpenY = this.scene.scale.height - this.displayHeight * .5;  // Coordinate for short texture (used in anim)

        this.openHeight = this.scene.textures.get('shopOpen').get().height;  // Height of long texture  
        this.adjustedOpenY = this.openHeight * this.scale * .4287;  // Coordinate for long texture

        this.hoverInc = this.displayHeight * .05;  // The height increase from hovering over while closed

        this.isOpen = false;
        this.isAnimDone = true;
        this.animLength = .7;
        this.animKey = 'open';
        this.scrollDispl = 0;  // Displacement due to scroll
    }

    #initInteraction() {
        this.rectColl = new Phaser.Geom.Rectangle(this.width * .42, this.height * .13, this.width * .55, this.height * .3);
        this.setInteractive(this.rectColl, Phaser.Geom.Rectangle.Contains); 
        
        this.on('pointerdown', this.onClick);
        this.on('pointerover', this.onEnter);
        this.on('pointerout', this.onExit);
    }

    #initAnims() {
        this.anims.create({
            key: 'open',
            frames: this.scene.anims.generateFrameNumbers('shopAnim', { start: 0, end: 8 }),
            frameRate: 9 / this.animLength,
            repeat: 0
        });

        this.on('animationcomplete', () => {
            this.#finished();

            if (this.isOpen) {
                this.#adjustToOpen();
                Input.addMapping('ShopPanelScroll', 'wheel', this.shopScroll.bind(this));
            }
        })
    }

    setPosition(x, y) {
        super.setPosition(x, y);
    }

    addItem(name, item) {
        this.shopItems.push({
            name: name,
            item: item
        });

        this.itemContainer.add(item.container);
        //this.textContainer.add(item.getText());
        //this.buyButtonContainer.add(item.getBuyButton());
    }

    removeItem(name) {
        const i = this.shopItems.findIndex(si => si.name === name);

        if (i !== -1) {
            this.shopItems.splice(i, 1);
        }
    }

    shopScroll(deltaY) {
        this.scene.tweens.killTweensOf(this.container);
        this.scrollDispl = Phaser.Math.Clamp(this.scrollDispl + deltaY, 0, 2300);
        
        this.#tween(this.defaultOpenY - this.scrollDispl, .2, 'Sine.out');
    }

    #adjustToOpen() {
        this.setTexture(ASSETS.image.shopOpen.key);
        this.setPosition(0, this.adjustedOpenY);
    }

    onClick() {
        if (this.isAnimDone) {
            this.isAnimDone = false;
            this.scene.tweens.killTweensOf(this.container);

            if (!this.isOpen) {
                this.isOpen = true;
                this.play(this.animKey);

                this.#tween(this.defaultOpenY, .5, 'Sine.inOut', () => {
                    this.#finished()
                });

            } else {
                this.isOpen = false;
                Input.removeMapping("ShopPanelScroll");

                const time = (this.defaultOpenY - this.container.y) / 600;
                this.#tween(this.defaultOpenY, time, 'Sine.in', () => {
                    this.playReverse(this.animKey);
                    this.setPosition(0, 0);

                    this.#tween(this.defaultPos.y, .5, 'Sine.inOut', () => {
                        this.#finished()
                    });
                })
            }
        }
    }

    #handleItemSlots() {
        var curPosition = new Phaser.Geom.Point(0, 0);

        this.shopItems.forEach( i => {
            if (this.isOpen) {
                i.item.spawn(curPosition.x, curPosition.y);

                if (curPosition.x != 0) {
                    curPosition.x = 0;
                    curPosition.y += this.itemOffset.y;
                } else {
                    curPosition.x += this.itemOffset.x;
                }
                
            } else {
                i.item.despawn();
            }
        });
    }

    #finished() {
        if (!this.scene.tweens.isTweening(this) && !this.anims.isPlaying) {
            this.isAnimDone = true;
            this.#handleItemSlots();
        }
    }

    #tween(y, duration, ease, action = () => {}, target = this.container) {
        this.scene.tweens.add({
            targets: target,
            y: y,
            duration: duration * 1000,
            ease: ease,
            yoyo: false,
            loop: 0,
            onComplete: () => {
                action();
            }
        });
    }

    onEnter() {
        if (this.isAnimDone && !this.isOpen) {
            this.#tween(this.defaultPos.y - this.hoverInc, .25, 'Sine.inOut');
        }
    }

    onExit() {
        if (this.isAnimDone && !this.isOpen) {
            this.#tween(this.defaultPos.y, .25, 'Sine.inOut');
        }
    }

    static addScoreText(text) {
        ShopPanel.curScoreContainer.add(text);
    }

    #debugItemLocations() {
        var curPosition = new Phaser.Geom.Point(0, 0);
        while (!(curPosition.y >= this.openHeight)) {
            Debug.addDebugCollider(this.itemContainer, new Phaser.Geom.Rectangle(curPosition.x, curPosition.y));
            Debug.addDebugCollider(this.itemContainer, new Phaser.Geom.Rectangle(curPosition.x + this.itemOffset.x, curPosition.y));
            curPosition.y += this.itemOffset.y;
        }
    }
}