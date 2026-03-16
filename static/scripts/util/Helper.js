export default class Helper {
    static scene;

    // xP & yP are proportions from 0 - 1
    static proporToCoords(xP, yP) {
        return new Phaser.Geom.Point(this.scene.scale.width * xP, this.scene.scale.height * yP);
    }

    static truncate(num, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.trunc(num * factor) / factor;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static abbreviateNum(num) {
        var scale = ""

        if (num > 1000000000000000000) {
            num /= 1000000000000000000;
            scale = " E";
        }if (num > 1000000000000000) {
            num /= 1000000000000000;
            scale = " P";
        } else if (num > 1000000000000) {
            num /= 1000000000000;
            scale = " T";
        } else if (num > 1000000000) {
            num /= 1000000000;
            scale = " G";
        } else if (num > 1000000) {
            num /= 1000000
            scale = " M";
        } else if (num > 1000) {
            num /= 1000;
            scale = " k";
        }

        num = Helper.truncate(num, 1);

        return num + scale;
    }
}