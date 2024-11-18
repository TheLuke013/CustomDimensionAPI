import { CustomDimension, CustomDimensionManager, TerrainMaterials } from "../api/dimension/CustomDimension";
import { SimpleVector3 } from "../api/utils/SimpleVector3";

const dimManager = new CustomDimensionManager();

//DIMENSION 1
const dimension1 = new CustomDimension(
    '013:dimension_1',
    new TerrainMaterials(),
    new SimpleVector3(-10000, 264, -10000),
    25
);

//DIMENSION 2
const dimension2 = new CustomDimension(
    '013:dimension_2',
    new TerrainMaterials(
        'minecraft:purpur_block',
        'minecraft:end_stone',
        'minecraft:end_stone',
        'minecraft:bedrock'
    ),
    new SimpleVector3(10000, 264, 10000),
    25
);

dimManager.registerDimension(dimension1);
dimManager.registerDimension(dimension2);