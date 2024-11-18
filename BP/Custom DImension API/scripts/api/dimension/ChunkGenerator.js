import FastNoiseLite from './FastNoiseLite.js';
import { FeaturesManager } from './FeaturesManager.js';

export class ChunkGenerator {
  constructor(dimensionSize, dimensionHeight, seed, frequency) {
    this.dimensionSize = dimensionSize;
    this.heightScale = dimensionHeight;
    this.groundLevel = -64;
    this.seed = seed;
    this.frequency = frequency;

    //dimension properties
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;
  }

  generateData(overworldDim, dimension, chunk) {
    //get dimension properties
    const mat = dimension.terrainMaterials;
    this.xOffset = dimension.chunkPositions[dimension.generatedChunksData][0];
    this.yOffset = dimension.chunkPositions[dimension.generatedChunksData][1];
    this.zOffset = dimension.chunkPositions[dimension.generatedChunksData][2];
    let topMaterial = mat.topMaterial;
    let midMaterial = mat.midMaterial;
    let foundationMaterial = mat.bottomMaterial;
    let baseMaterial = mat.baseMaterial;

    //configure noise
    const noise = new FastNoiseLite();
    noise.SetSeed(this.seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(this.frequency);

    for (let x = 0; x <= this.dimensionSize; x++) {
      for (let z = 0; z <= this.dimensionSize; z++) {

        const heightMap = Math.floor(noise.GetNoise(x + this.xOffset, z + this.zOffset) * 0.5 * this.heightScale);

        for (let y = this.groundLevel; y <= heightMap; y++) {
          const blockLoc = { x: this.xOffset + x, y: this.yOffset + y, z: this.zOffset + z };

          //generate terrain
          if (dimension.canGenerateTerrain) {
            this.generateTerrain(y, heightMap, topMaterial, midMaterial, foundationMaterial, baseMaterial, blockLoc, overworldDim, chunk);
          }

          //generate ores
          this.generateOres(dimension, x, y, z, overworldDim, blockLoc, dimension.namespace, chunk);
        }
      }
    }
  }

  generateTerrain(y, heightMap, topMaterial, midMaterial, foundationMaterial, baseMaterial, blockLoc, overworldDim, chunk) {
    if (y === this.groundLevel) {
      chunk.addBlock(blockLoc.x, blockLoc.y, blockLoc.z, baseMaterial);
    }
    else if (y < heightMap - 3) {
      chunk.addBlock(blockLoc.x, blockLoc.y, blockLoc.z, foundationMaterial);
    }
    else if (y >= heightMap - 3 && y < heightMap) {
      chunk.addBlock(blockLoc.x, blockLoc.y, blockLoc.z, midMaterial);
    }
    else if (y === heightMap) {
      chunk.addBlock(blockLoc.x, blockLoc.y, blockLoc.z, topMaterial);
    }
  }

  generateOres(dimension, x, y, z, overworldDim, blockLoc, dimNamespace, chunk) {
    const featuresManager = new FeaturesManager();

    //generate vanilla ores if true
    if (dimension.canGenerateVanillaOres) {
      featuresManager.vanillaOreFeatures.forEach(vanillaOre => {
        vanillaOre.generate(this.seed, x, y, z, overworldDim, blockLoc, chunk);
      });
    }

    //generate custom ores
    if (dimension.canGenerateCustomOres) {
      featuresManager.oreFeatures.forEach(ore => {
        if (ore.dimension === dimNamespace) {
          ore.generate(this.seed, x, y, z, overworldDim, blockLoc, chunk);
        }
      });
    }
  }
}
