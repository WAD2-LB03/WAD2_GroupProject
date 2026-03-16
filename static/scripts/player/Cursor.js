export default class Cursor extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.scene.input.setDefaultCursor('none');

        this.lineStyle(2, 0xFFFFFF, 1);
        this.strokeCircle(0, 0, 4);
        this.setDepth(1000);

        this.scene.add.existing(this);
    }

    update() {
        const pointer = this.scene.input.activePointer;
        this.x = pointer.x;
        this.y = pointer.y;
    }
}