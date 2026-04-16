import {
  CustomDimension,
  CustomDimensionManager,
  TerrainMaterials,
} from "../api/dimension/CustomDimension";

const dimManager = new CustomDimensionManager();

//DIMENSION 1
const dimension1 = new CustomDimension(
  "custom_dim:dimension_1",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  25,
);
dimension1.onFirstGeneration = (dimension) => {
  dimension.runCommand('fill -10 63 -10 10 63 10 stone');
}

//DIMENSION 2
const dimension2 = new CustomDimension(
  "custom_dim:dimension_2",
  new TerrainMaterials(
    "minecraft:purpur_block",
    "minecraft:end_stone",
    "minecraft:end_stone",
    "minecraft:bedrock",
  ),
  { x: 0, y: 64, z: 0 },
  25,
);

dimManager.registerDimension(dimension1);
dimManager.registerDimension(dimension2);
