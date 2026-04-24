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
    verticalChunkSize,
    reliefType = ReliefType.HILLS
  ) {
    this.namespace = namespace;
    this.terrainMaterials = terrainMaterials;
    this.spawnLoc = spawnLoc;
    this.maxChunks = 128; //isso só se aplica  generationType FIXED
    this.VerticalChunkSize = verticalChunkSize;
    this.generationType = GenerationType.FIXED;
    this.reliefType = reliefType;
    this.canGenerateTerrain = true;
    this.canGenerateCommonFeatures = true;
    this.canGenerateVanillaOres = true;
    this.canGeneratePortal = true;
    this.canGenerateLakes = true;
    this.canSpawnVanillaMobs = true;
    this.dimensionFog = '';
    this.onFirstGeneration = null;
    this.onEnters = null;
    this.onLeaves = null;
    this.onChunkGeneration = null;
  }
}

export class TerrainMaterials {
  constructor(
    topMat = "grass_block",
    midMat = "dirt",
    bottomMat = "stone",
    baseMat = "bedrock",
  ) {
    this.topMaterial = topMat;
    this.midMaterial = midMat;
    this.bottomMaterial = bottomMat;
    this.baseMaterial = baseMat;
  }
}

export const VerticalChunkSize = {
    HIGH: 'high',       //128 heigh
    MEDIUM: 'medium',   //64 heigh
    LOW: 'low'          //32 heigh
};

export const GenerationType = {
  FIXED: 'fixed',           //dimension size limited
  DYNAMIC: 'dynamic'        //dimension infinite size
};

export const ReliefType = {
  FLAT: 'flat',                           //totalmente plano
  HILLS: 'hills',                         //colinas suaves
  MOUNTAINS: 'mountains',                 //montanhas altas
  PLAINS: 'plains',                       //planícies levemente onduladas
  ISLAND_CHAIN: 'island_chain',           //cadeia de ilhas
  OCEAN: 'ocean',                         //oceano profundo
  HILLS_WITH_RIVERS: 'hills_with_rivers'  //colinas suaves com rios sinuosos
};

export const DimensionType = {
  OVERWORLD: 'overworld',
  NETHER: 'nether',
  END: 'end',
  CUSTOM: 'custom'
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
