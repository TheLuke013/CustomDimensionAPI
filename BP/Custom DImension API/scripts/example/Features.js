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
  20,
  0.5,
);
feature.addToDimension("custom_dim:dimension_1");

featuresManager.registerFeature(feature);
