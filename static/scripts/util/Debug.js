export default class Debug {
    static scene;
    static g;
    static active = true;

    static colliders = [];  // {sprite, collider}

    static init(scene) {
        Debug.scene = scene;

        Debug.g = Debug.scene.add.graphics();
        Debug.g.setDepth(1000);
    }

    static addDebugCollider(sprite, collider) {
        Debug.colliders.push({
            sprite: sprite, 
            collider: collider
        });
    }

    static update() {
        Debug.g.clear();
        Debug.g.lineStyle(2, 0xff0000, 1);

        Debug.colliders.forEach( ({sprite, collider}) => {
            if (!sprite.active) {
                Debug.colliders.delete(sprite);
            } else {
                Debug.#drawHitArea(sprite, collider);
            }
        });
    }

    static #drawHitArea(sprite, collider) {
        const matrix = sprite.getWorldTransformMatrix();
        const x = matrix.tx;
        const y = matrix.ty;

        if (collider instanceof Phaser.Geom.Circle) {
            Debug.g.strokeCircle(
                x - sprite.displayWidth * .5 + collider.x * sprite.scale,
                y - sprite.displayHeight * .5 + collider.y * sprite.scale,
                collider.radius * sprite.scale
            );
        } else if (collider instanceof Phaser.Geom.Rectangle) {
            Debug.g.strokeRect(
                x - sprite.displayWidth * .5 + collider.x * sprite.scale,
                y - sprite.displayHeight * .5 + collider.y * sprite.scale,
                collider.width * sprite.scale,
                collider.height * sprite.scale
            );
        } else if (collider instanceof Phaser.Geom.Point) { // Doesn't work for some reason
            Debug.g.fillPoint(
                x - sprite.displayWidth * .5 + collider.x * sprite.scale,
                y - sprite.displayHeight * .5 + collider.y * sprite.scale,
                5
            );
        }
    }
}