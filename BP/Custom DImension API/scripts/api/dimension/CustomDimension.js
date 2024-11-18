import { world } from "@minecraft/server";
import { generateRandomSeed } from "../utils/Utils";
import { ChunkGenerator } from "./ChunkGenerator";

export class CustomDimension {
    constructor(namespace, terrainMaterials, location, maxChunks, frequency = 0.02) {
        this.namespace = namespace;
        this.terrainMaterials = terrainMaterials
        this.location = location;
        this.maxChunks = maxChunks
        this.seed = generateRandomSeed();
        this.generatedChunks = 0;
        this.generatedChunksData = 0;
        this.terrainGenerated = false;
        this.frequency = frequency;
        this.chunkPositions = [];
        this.chunkPosGenerated = false;
        this.canGenerateTerrain = true;
        this.canGenerateVanillaOres = false;
        this.canGenerateCustomOres = false;
        this.chunks = [];
        this.generator = new ChunkGenerator(16, 16, this.seed, this.frequency);
    }

    generateChunksData() {
        //generate chunks classes
        for (let i = 0; i <= this.maxChunks; i++) {
            const chunk = new Chunk();
            this.chunks.push(chunk);
        }

        //generate chunk positions
        this.chunkPositions = this.generateChunkPositions();

        //generate chunks data
        this.chunks.forEach(chunk => {
            this.generator.generateData(world.getDimension('overworld'), this, chunk);
            this.generatedChunksData++;
        });
    }

    generateChunkPositions() {
        const chunkPositions = [];
        const chunkSize = 16;
    
        let generatedPos = 0;
    
        for (let radius = 0; radius <= this.maxChunks; radius++) {
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    if (Math.abs(dx) === radius || Math.abs(dz) === radius) {
                        const x = this.location.x + dx * chunkSize;
                        const y = this.location.y;
                        const z = this.location.z + dz * chunkSize;
    
                        chunkPositions[generatedPos] = [x, y, z];
                        generatedPos++;
                    }
                }
            }
        }
    
        return chunkPositions;
    }
}

class Chunk {
    constructor() {
        this.blocks = [];
    }

    addBlock(x, y, z, namespace) {
        const blockData = new BlockData(x, y, z, namespace);
        this.blocks.push(blockData);
    }

    getBlock(x, y, z) {
        return this.blocks.find(block => block.x == x && block.y == y && block.z == z);
    }
}

class BlockData {
    constructor(x, y, z, namespace) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.namespace = namespace;
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