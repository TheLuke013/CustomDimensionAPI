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

const feature3 = new Feature(
  "minecraft:amethyst_geode_feature",
  FeatureType.FEATURE,
  HeightRange.UNDERGROUND,
  1,
  0.1,
);
feature3.addToDimension("custom_dim:dimension_1");

const feature4 = new Feature(
  "mystructure:mantis_nest",
  FeatureType.STRUCTURE,
  HeightRange.SURFACE,
  1,
  0.1,
);
feature4.addToDimension("custom_dim:dimension_1");


featuresManager.registerFeature(feature);
featuresManager.registerFeature(feature3);
featuresManager.registerFeature(feature4);