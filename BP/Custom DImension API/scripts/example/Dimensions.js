import {
  CustomDimension,
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType
} from "../dimension_api/dimension/CustomDimension";

const dimManager = new CustomDimensionManager();

//DIMENSION 1
const dimension1 = new CustomDimension(
  "custom_dim:dimension_1",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.LOW,
  ReliefType.PLAINS
);

dimension1.canSpawnVanillaMobs = false;
dimension1.maxChunks = 128;

//DIMENSION 2
const dimension2 = new CustomDimension(
  "custom_dim:dimension_2",
  new TerrainMaterials(
    "purpur_block",
    "end_stone",
    "end_stone",
    "bedrock",
  ),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.LOW
);

dimension2.canSpawnVanillaMobs = false;
dimension2.canGenerateVanillaOres = false;
dimension2.canGenerateCommonFeatures = false;

dimManager.registerDimension(dimension1);
dimManager.registerDimension(dimension2);
