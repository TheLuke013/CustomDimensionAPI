import { CustomDimension, CustomDimensionManager } from "../api/dimension/CustomDimension";

const dimManager = new CustomDimensionManager();

const dimension1 = new CustomDimension(
    '013:dimension_1',
    'minecraft:grass_block',
    'minecraft:dirt',
    'minecraft:stone',
    'minecraft:bedrock',
    [-10000, 200, -10000]
);

dimManager.registerDimension(dimension1);