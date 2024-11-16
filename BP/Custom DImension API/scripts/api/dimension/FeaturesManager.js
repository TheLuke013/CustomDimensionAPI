import { OreFeature } from "./OreFeature";

export class FeaturesManager {
    constructor() {
        if (FeaturesManager.instance) {
            return FeaturesManager.instance;
        }

        FeaturesManager.instance = this;
        this.oreFeatures = [];
        this.vanillaOreFeatures = [];
    }

    registerOreFeature(oreFeature) {
        if (oreFeature instanceof OreFeature) {
            this.oreFeatures.push(oreFeature);
        }
    }

    registerVanillaOreFeature(vanillaOreFeature) {
        if (vanillaOreFeature instanceof OreFeature) {
            this.vanillaOreFeatures.push(vanillaOreFeature);
        }
    }
}