import { generateRandomSeed } from "../utils/Utils";

export class CustomDimension {
    constructor(namespace, terrainMaterials, location, maxChunks, frequency = 0.02) {
        this.namespace = namespace;
        this.terrainMaterials = terrainMaterials
        this.location = location;
        this.maxChunks = maxChunks
        this.seed = generateRandomSeed();
        this.generatedChunks = 0;
        this.terrainGenerated = false;
        this.frequency = frequency;
        this.chunkPositions = [];
        this.chunkPosGenerated = false;
        this.canGenerateTerrain = true;
        this.canGenerateVanillaOres = true;
    }
}

export class TerrainMaterials {
    constructor(
        topMat = 'minecraft:grass_block',
        midMat = 'minecraft:dirt',
        bottomMat = 'minecraft:stone',
        baseMat = 'minecraft:bedrock') {
        this.topMaterial = topMat;
        this.midMaterial = midMat;
        this.bottomMaterial = bottomMat;
        this.baseMaterial = baseMat;
    }
}

export class CustomDimensionManager {
    constructor() {
        if (CustomDimensionManager.instance) {
            return CustomDimensionManager.instance;
        }

        CustomDimensionManager.instance = this;
        this.dimensions = [];
    }

    registerDimension(dimension) {
        if (dimension instanceof CustomDimension) {
            this.dimensions.push(dimension);
        }
    }

    getDimension(namespace) {
        return this.dimensions.find(dimension => dimension.namespace === namespace);
    }
}