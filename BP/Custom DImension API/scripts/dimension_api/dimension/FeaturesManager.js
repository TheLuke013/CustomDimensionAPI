export class FeaturesManager {
    constructor() {
        if (FeaturesManager.instance) {
            return FeaturesManager.instance;
        }

        FeaturesManager.instance = this;
        this.features = [];
    }

    registerFeature(featureNamespace) {
        this.features.push(featureNamespace);
    }
}