import FastNoiseLite from './FastNoiseLite.js';

export class ChunkGenerator {
  constructor(dimensionSize, dimensionHeight, seed, frequency) {
    this.dimensionSize = dimensionSize;
    this.heightScale = dimensionHeight;
    this.groundLevel = -64;
    this.seed = seed;
    this.frequency = frequency;
  }

  generate(overworldDim, dimension) {
    //get dimension properties
    const mat = dimension.terrainMaterials;
    let xOffset = dimension.chunkPositions[dimension.generatedChunks][0];
    let yOffset = dimension.chunkPositions[dimension.generatedChunks][1];
    let zOffset = dimension.chunkPositions[dimension.generatedChunks][2];
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

        const heightMap = Math.floor(noise.GetNoise(x + xOffset, z + zOffset) * 0.5 * this.heightScale);
        
        for (let y = this.groundLevel; y <= heightMap; y++) {
          const blockLoc = { x: xOffset + x, y: yOffset + y, z: zOffset + z };

          //generate terrain
          if (dimension.canGenerateTerrain) {
            this.generateTerrain(y, heightMap, topMaterial, midMaterial, foundationMaterial, baseMaterial, blockLoc, overworldDim);
          }

          //generate ores
          this.generateOres(dimension.canGenerateVanillaOres, x, y, z, overworldDim, blockLoc);
        }
      }
    }
  }

  generateTerrain(y, heightMap, topMaterial, midMaterial, foundationMaterial, baseMaterial, blockLoc, overworldDim) {
    if (y === this.groundLevel) {
      overworldDim.setBlockType(blockLoc, baseMaterial);
    }
    else if (y < heightMap - 3) {
      overworldDim.setBlockType(blockLoc, foundationMaterial);
    }
    else if (y >= heightMap - 3 && y < heightMap) {
      overworldDim.setBlockType(blockLoc, midMaterial);
    }
    else if (y === heightMap) {
      overworldDim.setBlockType(blockLoc, topMaterial);
    }
  }

  generateOres(canGenerateVanillaOres, x, y, z, overworldDim, blockLoc) {
    //configure noise to ores
    const noise = new FastNoiseLite();
    noise.SetSeed(this.seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(0.1);
    const noiseValue = noise.GetNoise(x, y, z);

    if (noiseValue > 0.5) {

      const blockType = noiseValue > 0.7 ? "minecraft:diamond_ore" : "minecraft:iron_ore";
      overworldDim.setBlockType(blockLoc, blockType);
    }
  }
}
