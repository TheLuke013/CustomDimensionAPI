import { FeaturesManager } from "./FeaturesManager";
import { OreFeature } from "./OreFeature";

const featuresManager = new FeaturesManager();

const coalOre = new OreFeature("minecraft:coal_ore", "minecraft:stone", 0.15, null, 0, 128, 0.6);
const ironOre = new OreFeature("minecraft:iron_ore", "minecraft:stone", 0.20, null, 0, 60, 0.6);
const goldOre = new OreFeature("minecraft:gold_ore", "minecraft:stone", 0.90, null, 0, 20, 0.7);
const diamondOre = new OreFeature("minecraft:diamond_ore", "minecraft:stone", 1.30, null, 0, 12, 0.7);
const redstoneOre = new OreFeature("minecraft:redstone_ore", "minecraft:stone", 0.80, null, 0, 20, 0.7);
const copperOre = new OreFeature("minecraft:copper_ore", "minecraft:stone", 0.10, null, 0, 128, 0.6);

featuresManager.registerVanillaOreFeature(coalOre);
featuresManager.registerVanillaOreFeature(ironOre);
featuresManager.registerVanillaOreFeature(goldOre);
featuresManager.registerVanillaOreFeature(diamondOre);
featuresManager.registerVanillaOreFeature(redstoneOre);
featuresManager.registerVanillaOreFeature(copperOre);