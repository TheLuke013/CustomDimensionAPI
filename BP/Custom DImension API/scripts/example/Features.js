import { world, system } from "@minecraft/server";
import {
  FeaturesManager,
  Feature,
  FeatureType,
  HeightRange,
} from "../dimension_api/dimension/FeaturesManager";

const featuresManager = new FeaturesManager();

const feature = new Feature(
  "minecraft:oak_tree_feature",
  FeatureType.FEATURE,
  HeightRange.SURFACE,
  10,
  0.5,
);
feature.addToDimension("custom_dim:dimension_1");

const feature2 = new Feature(
  "custom_dim:custom_tree",
  FeatureType.CUSTOM,
  HeightRange.SURFACE,
  5,
  0.1,
);
feature2.onGenerate = (dimension, location) => {
    
};
feature2.addToDimension("custom_dim:dimension_1");


featuresManager.registerFeature(feature);
//featuresManager.registerFeature(feature2);