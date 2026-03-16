import Helper from '../util/Helper.js';

import Score from './Score.js';
import Input from './Input.js';

import Operator from '../enums/Operator.js';

class Player {
    constructor() {
        this.#initVariables();
    }

    setupPlayer(scene) {
        this.scene = scene;

        Input.setupInput(this.scene);
        
        this.score = new Score(this.scene);
    }

    #initVariables() {
        this.updates = [];
        this.upgrades = new Map();

        this.maxUpgradeStages = 5;
        
        this.baseClickPower = 1;
        this.baseDonutsPS = 0;
        this.clickPower = this.baseClickPower;
        this.donutsPS = this.baseDonutsPS;

        this.secondTimer = 0;
    }

    update(dT) {
        this.secondTimer += dT;

        while (this.secondTimer >= 1) {
            this.secondTimer -= 1;

            this.secondElapsed();
        }

        this.score.updateText(dT);

        this.updates.forEach( u => u.func(dT) );
    }

    secondElapsed() {
        this.addScore(this.donutsPS);
    }

    donutClicked() {
        this.addScore(this.clickPower);
    }

    addScore(score) {
        this.score.addScore(score);
    }
    spendScore(score) {
        this.score.spendScore(score);
    }

    canAfford(price) {
        if (price <= this.score.getCurScore()) {
            return true;
        } else {
            return false;
        }
    }

    alterClickPower(operator, value) {
        switch (operator) {
            case Operator.Add:
                this.clickPower += value;
                break;
            case Operator.Sub:
                this.clickPower -= value;
                break;
            case Operator.Mult:
                this.clickPower *= value;
                break;
            case Operator.Div:
                this.clickPower /= value;
                break;
        }
    }

    alterDPS(operator, value) {
        switch (operator) {
            case Operator.Add:
                this.donutsPS += value;
                break;
            case Operator.Sub:
                this.donutsPS -= value;
                break;
            case Operator.Mult:
                this.donutsPS *= value;
                break;
            case Operator.Div:
                this.donutsPS /= value;
                break;
        }
    }

    addUpdate(name, func) {
        this.updates.push({
            name: name, 
            func: func
        });
    }

    removeUpdate(name) {
        const i = this.updates.findIndex(u => u.name === name);

        if (i !== -1) {
            this.updates.splice(i, 1);
        }
    }

    upgradePurchased(upgrade, price) {
        this.spendScore(price);

        var stage = upgrade.getStage();

        if (this.upgrades.has(stage)) {
            this.upgrades.get(stage).push(upgrade);
        } else {
            this.upgrades.set(stage, [upgrade]);
        }

        this.clickPower = this.baseClickPower;
        this.donutsPS = this.baseDonutsPS;

        for (let i = 1; i <= this.maxUpgradeStages; i++) {
            if (this.upgrades.has(i)) {
                this.upgrades.get(i).forEach(u => {
                    u.executeUpgrade();
                });
            }
        }
    }
}

const instance = new Player();

export default instance;