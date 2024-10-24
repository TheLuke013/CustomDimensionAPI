import FastNoiseLite from './FastNoiseLite.js';

export class ChunkGenerator {
  constructor(dimensionSize, dimensionHeight, seed, frequency) {
    this.dimensionSize = dimensionSize;
    this.heightScale = dimensionHeight;
    this.groundLevel = -64;
    this.seed = seed;
    this.frequency = frequency;
  }

  generate(xOffset, yOffset, zOffset, dimension, topMaterial, midMaterial, foundationMaterial, baseMaterial) {
    const noise = new FastNoiseLite();
    noise.SetSeed(this.seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(this.frequency);

    for (let x = 0; x <= this.dimensionSize; x++) {
      for (let z = 0; z <= this.dimensionSize; z++) {
        const heightMap = Math.floor(noise.GetNoise(x + xOffset, z + zOffset) * 0.5 * this.heightScale);

        for (let y = this.groundLevel; y <= heightMap; y++) {
          const blockLoc = { x: xOffset + x, y: yOffset + y, z: zOffset + z };

          if (y === this.groundLevel) {
            dimension.setBlockType(blockLoc, baseMaterial);
          }
          else if (y < heightMap - 4) {
            dimension.setBlockType(blockLoc, foundationMaterial);
          }
          else if (y >= heightMap - 3 && y < heightMap) {
            dimension.setBlockType(blockLoc, midMaterial);
          }
          else if (y === heightMap) {
            dimension.setBlockType(blockLoc, topMaterial);
          }
        }
      }
    }
  }
}
