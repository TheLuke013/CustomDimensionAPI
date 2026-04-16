import { world, system } from "@minecraft/server";
import { ChunkGenerator } from "./ChunkGenerator";

system.beforeEvents.startup.subscribe((event) => {
  const dimManager = new CustomDimensionManager();
  dimManager.dimensions.forEach((dim) => {
    event.dimensionRegistry.registerCustomDimension(dim.namespace);
  });
});

export class CustomDimension {
  constructor(
    namespace,
    terrainMaterials,
    spawnLoc,
    verticalChunkSize
  ) {
    this.namespace = namespace;
    this.terrainMaterials = terrainMaterials;
    this.spawnLoc = spawnLoc;
    this.maxChunks = 24;
    this.VerticalChunkSize = verticalChunkSize;
    this.generatedChunks = 0;
    this.chunks = [];
    this.canGenerateTerrain = true;
    this.canGenerateCommonFeatures = true;
    this.canGenerateVanillaOres = true;
    this.canGeneratePortal = true;
    this.dimensionFog = '';
    this.onFirstGeneration = null;
  }
}

export class TerrainMaterials {
  constructor(
    topMat = "minecraft:grass_block",
    midMat = "minecraft:dirt",
    bottomMat = "minecraft:stone",
    baseMat = "minecraft:bedrock",
  ) {
    this.topMaterial = topMat;
    this.midMaterial = midMat;
    this.bottomMaterial = bottomMat;
    this.baseMaterial = baseMat;
  }
}

export const VerticalChunkSize = {
    HIGH: 'high', //128 heigh
    MEDIUM: 'medium', //64 heigh
    LOW: 'low' //32 heigh
};

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
    return this.dimensions.find(
      (dimension) => dimension.namespace === namespace,
    );
  }
}
