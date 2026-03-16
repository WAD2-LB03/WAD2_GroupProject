export default class Upgrade {
    constructor(stage, upgrade) {
        this.upgrade = upgrade;
        this.stage = stage;  // Lower equals executes before late stage upgrades
    }

    getStage() {
        return this.stage;
    }

    executeUpgrade() {
        this.upgrade();
    }
}