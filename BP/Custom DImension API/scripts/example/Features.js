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
  "minecraft:lapis_ore_feature",
  FeatureType.FEATURE,
  HeightRange.UNDERGROUND,
  10,
  0.5,
);
feature2.addToDimension("custom_dim:dimension_1");

const feature3 = new Feature(
  "minecraft:amethyst_geode_feature",
  FeatureType.FEATURE,
  HeightRange.UNDERGROUND,
  1,
  0.5,
);
feature3.addToDimension("custom_dim:dimension_1");

const feature4 = new Feature(
  "mystructure:mantis_nest",
  FeatureType.STRUCTURE,
  HeightRange.SURFACE,
  1,
  0.5,
);
feature4.addToDimension("custom_dim:dimension_1");

const feature5 = new Feature(
  "minecraft:tall_grass_feature",
  FeatureType.FEATURE,
  HeightRange.SURFACE,
  10,
  0.5,
);
feature5.addToDimension("custom_dim:dimension_1");

featuresManager.registerFeature(feature);
featuresManager.registerFeature(feature2);
featuresManager.registerFeature(feature3);
featuresManager.registerFeature(feature4);
featuresManager.registerFeature(feature5);