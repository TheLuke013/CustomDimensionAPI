import { world } from '@minecraft/server';
import { detectSurfaceFloor } from "../utils/Utils.js";

export const HeightRange = {
  SURFACE: 'surface',
  UNDERGROUND: 'underground',
  ANY: 'any',
};

export const FeatureType = {
  FEATURE: 'feature',
  STRUCTURE: 'structure',
  CUSTOM: 'custom'
};

export class Feature {
  constructor(namespace, featureType, heightRange, iterations, chance) {
    this.namespace = namespace;
    this.featureType = featureType;
    this.heightRange = heightRange;
    this.iterations = iterations;
    this.chance = chance;
    this.dimensions = [];
    this.onGenerate = null;
  }

  addToDimension(dimensionNamespace) {
    this.dimensions.push(dimensionNamespace);
  }

  shouldGenerate(chunkX, chunkZ, surfaceHeight) {
    if (Math.random() > this.chance) return false;
    
    if (this.heightRange === HeightRange.SURFACE) {
      return surfaceHeight > 10 && surfaceHeight < 250;
    } else if (this.heightRange === HeightRange.UNDERGROUND) {
      return surfaceHeight > 10;
    }
    
    return true;
  }

  generate(dimension, dimClass, chunkLoc, surfaceHeight, iterationsMultiplier = 1) {
    if (!this.shouldGenerate(chunkLoc.x, chunkLoc.z, surfaceHeight)) return;
    
    const totalIterations = this.iterations * iterationsMultiplier;
    let generatedCount = 0;
    
    for (let i = 0; i < totalIterations; i++) {
      const offsetX = Math.floor(Math.random() * 16);
      const offsetZ = Math.floor(Math.random() * 16);

      const worldX = chunkLoc.x + offsetX;
      const worldZ = chunkLoc.z + offsetZ;

      const surfaceY = detectSurfaceFloor(
        dimension,
        { x: worldX, y: 50, z: worldZ },
        dimClass.terrainMaterials.topMaterial,
        -10,
        100
      );

      let featureY = surfaceY + Math.floor(Math.random() * 2);
      
      if (this.heightRange === HeightRange.SURFACE) {
        featureY = surfaceHeight + Math.floor(Math.random() * 3);
      } else if (this.heightRange === HeightRange.UNDERGROUND) {
        const minY = Math.max(0, surfaceHeight - 50);
        const maxY = Math.max(5, surfaceHeight - 10);
        featureY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      } else if (this.heightRange === HeightRange.ANY) {
        featureY = Math.floor(Math.random() * 251);
      } else {
        featureY = surfaceHeight;
      }
      
      const featureLoc = {
        x: chunkLoc.x + offsetX,
        y: featureY,
        z: chunkLoc.z + offsetZ
      };
      
      try {
        if (this.featureType === FeatureType.FEATURE) {
          dimension.placeFeature(this.namespace, featureLoc);
        } else if (this.featureType === FeatureType.STRUCTURE) {
          world.structureManager.place(this.namespace, dimension, featureLoc);
        } else if (this.featureType === FeatureType.CUSTOM) {
          if (typeof this.onGenerate === "function") {
            this.onGenerate(dimension, featureLoc);
          }
        }
        generatedCount++;
      } catch (error) {
      }
    }
    
    return generatedCount;
  }
}

export class FeaturesManager {
  constructor() {
    if (FeaturesManager.instance) {
      return FeaturesManager.instance;
    }

    FeaturesManager.instance = this;
    this.features = [];
  }

  registerFeature(feature) {
    if (feature instanceof Feature) {
      this.features.push(feature);
    }
  }

  getFeature(namespace) {
    return this.features.find(
      (feature) => feature.namespace === namespace,
    );
  }

  generateFeaturesForChunk(dimension, dimClass, chunkLoc, surfaceHeight) {
    const relevantFeatures = this.features.filter(feature => 
      feature.dimensions.includes(dimClass.namespace)
    );
    
    let totalGenerated = 0;
    
    for (const feature of relevantFeatures) {
      const iterationsMultiplier = dimClass.VerticalChunkSize === 'high' ? 1.5 : 
                                    dimClass.VerticalChunkSize === 'low' ? 0.5 : 1;
      
      const generated = feature.generate(
        dimension,
        dimClass,
        chunkLoc, 
        surfaceHeight, 
        iterationsMultiplier
      );
      
      if (generated > 0) {
        totalGenerated += generated;
        if (dimClass.debugMode) {
          world.sendMessage(`§aGerou ${generated}x ${feature.namespace} na chunk ${chunkLoc.x}, ${chunkLoc.z}`);
        }
      }
    }
    
    return totalGenerated;
  }
}
