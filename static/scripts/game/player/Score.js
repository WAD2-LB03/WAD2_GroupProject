import Helper from '../util/Helper.js';

import ShopPanel from '../objects/ShopPanel.js';

export default class Score {
    constructor(scene) {
        this.scene = scene;

        this.#initVariables();
        this.#setupText(.5, .5);
    }

    #initVariables() {
        this.totalScore = 0;
        this.curScore = 0;

        this.rotTime = 0;
        this.rotDegree = 30;  // Amount of degrees the text will rotate either direction
        this.rotSpeed = 2;  // Lower = faster

        this.tempTexts = [];
        this.spawnRange = new Phaser.Geom.Point(this.scene.scale.width * .15, this.scene.scale.height * .15);
        this.dissipateRate = 1;  // Opacity per second (1 == vanish in 1 sec)
        this.riseRate = 100;
    }

    #setupText(posX, posY) {
        const pos = Helper.proporToCoords(posX, posY);

        this.totalText = this.scene.add.text(pos.x, pos.y, this.totalScore, {fontFamily: 'Silkscreen', fontSize: '24px', color: '0xffffff'});
        this.totalText.setScale(3);
        this.totalText.setOrigin(.5, .5);
        this.totalText.setAlpha(.2);
        this.totalText.setDepth(-999)

        this.curText = this.scene.add.text(0, 0, this.curScore, {fontFamily: 'Silkscreen', fontSize: '36px', color: '0xffffff'});
        this.curText.setLetterSpacing(-5);
        ShopPanel.addScoreText(this.curText);
    }

    updateText(dT) {
        this.rotTime += dT;
        this.totalText.setAngle(this.rotDegree * Math.sin(this.rotTime * this.rotSpeed));

        this.#updateTempText(dT);
    }

    addScore(score) {
        this.totalScore += score;
        this.curScore += score;
        
        this.#updateText();
        this.#addTempText(score);
    }

    spendScore(score) {
        this.curScore -= score;

        this.#updateText();
    }

    getTotalScore() {
        return this.totalScore;
    }

    getCurScore() {
        return this.curScore;
    }

    #addTempText(score) {
        const spawnX = Helper.randomInt(this.scene.centreX - this.spawnRange.x, this.scene.centreX + this.spawnRange.x);
        const spawnY = Helper.randomInt(this.scene.centreY - this.spawnRange.y, this.scene.centreY + this.spawnRange.y);
        const text = this.scene.add.text(spawnX, spawnY, "+" + score, {fontFamily: 'Silkscreen', fontSize: '16px', color: '0xffffff'});
        this.tempTexts.push(text);
    }

    #updateTempText(dT) {
        for (let i = 0; i < this.tempTexts.length; i++) {
            let t = this.tempTexts[i];
            let alpha = t.alpha - this.dissipateRate * dT;
            
            if (alpha <= 0) {
                this.tempTexts.splice(i, 1);
                t.destroy();
                return;
            }

            t.setAlpha(alpha);
            t.setPosition(t.x, t.y - this.riseRate * dT);
        }
    }

    #updateText() {
        this.totalText.setText(this.totalScore);

        this.curText.setText(Helper.abbreviateNum(this.curScore));
    }
}