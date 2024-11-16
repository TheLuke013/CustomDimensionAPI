import FastNoiseLite from "./FastNoiseLite";

export class OreFeature {
    constructor(placesBlock, mayReplace, frequency, dimension, yMin, yMax, noiseThreshold) {
        this.placesBlock = placesBlock;
        this.mayReplace = mayReplace;
        this.frequency = frequency;
        this.dimension = dimension;
        this.yMin = -(64 - yMin);
        this.yMax = -(64 - yMax);
        this.noiseThreshold = noiseThreshold;
        this.noise = new FastNoiseLite();
    }

    generate(seed, x, y, z, overworldDim, blockLoc) {
        this.noise.SetSeed(seed);
        this.noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        this.noise.SetFrequency(this.frequency);
        const noiseValue = this.noise.GetNoise(x, y, z);

        if (y >= this.yMin && y <= this.yMax && noiseValue > this.noiseThreshold) {
            const block = overworldDim.getBlock(blockLoc);

                if (block && block.typeId == this.mayReplace) {
                    overworldDim.setBlockType(blockLoc, this.placesBlock);
                }
        }        
    }
}