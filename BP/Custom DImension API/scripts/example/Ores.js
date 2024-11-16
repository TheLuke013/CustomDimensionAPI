import { FeaturesManager } from "../api/dimension/FeaturesManager";
import { OreFeature } from "../api/dimension/OreFeature";

const featuresManager = new FeaturesManager();

const dimension2Ore = new OreFeature("minecraft:amethyst_block", "minecraft:end_stone", 0.25, "013:dimension_2", 0, 128, 0.6);

featuresManager.registerOreFeature(dimension2Ore);