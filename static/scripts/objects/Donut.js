import Debug from '../util/Debug.js';

import ASSETS from '../assets.js';

export default class Donut extends Phaser.GameObjects.Sprite {
    constructor(scene, scale = 1, asset) {
        // Makes this an abstract class - no Donut can be instantiated
        if (new.target === Donut) {
            throw new Error("Abstract class - Cannot instantiate");
        }

        super(scene, scene.centreX, scene.centreY, asset.key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.setScale(scale);
        this.initInteraction(); 

        if (Debug.active) {
            Debug.addDebugCollider(this, this.circleColl);
        }
    }

    initInteraction() {
        this.radius = this.width * 0.5;
        this.circleColl = new Phaser.Geom.Circle(this.radius, this.radius, this.radius);
        this.setInteractive(this.circleColl, Phaser.Geom.Circle.Contains); 
        
        this.on('pointerdown', this.onClick);
    }

    onClick() {
        console.log("cwick");
    }
}