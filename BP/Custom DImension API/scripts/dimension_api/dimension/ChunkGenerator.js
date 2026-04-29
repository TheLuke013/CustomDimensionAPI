import { world } from '@minecraft/server';
import { ChunkSpiralGenerator } from './ChunkSpiralGenerator.js';
import { VerticalChunkSize, ReliefType, WorldType } from "./CustomDimension.js";
import { FeaturesManager } from './FeaturesManager.js'
import { detectSurfaceFloor } from "../utils/Utils.js";

const featuresManager = new FeaturesManager();

export class ChunkGenerator {
  constructor(dimension, dimClass) {
    this.dimension = dimension;
    this.dimClass = dimClass;
    this.chunkSpiralGenerator = new ChunkSpiralGenerator(dimClass.spawnLoc, dimClass.maxChunks);
  }

  generateAllChunks() {
    this.chunkSpiralGenerator.onChunkBehaviour = (chunkLoc) => {
      this.generateChunk(chunkLoc);
      if (typeof this.dimClass.onChunkGeneration === "function") {
        this.dimClass.onChunkGeneration(this.dimension, chunkLoc);
      }
    };

    this.chunkSpiralGenerator.generateChunks();
  }

  generateChunk(loc) {
    if (!this.dimClass.canGenerateTerrain) return;

    if (this.dimClass.worldType === WorldType.OVERWORLD) {
      this._generateBaseChunk(loc);
      this._setChunkMaterials(loc);
    } else if (this.dimClass.worldType === WorldType.NETHER) {
      this._generateBaseChunk(loc);
      this._generateOverChunk(loc);
      this._setChunkMaterials(loc);
    } else if (this.dimClass.worldType === WorldType.END) {
      this.dimension.placeFeatureRule("custom_dim:islands_feature", loc);
      this._setChunkMaterials(loc);
    }

    this._generateCustomFeatures(loc);

    this.dimension.runCommand(`tickingarea add circle ${loc.x} ${loc.y} ${loc.z} 4 temp`);
    this.dimension.runCommand(`tickingarea remove temp`);

    this.chunkSpiralGenerator.chunksGenerated++;
  }

  _generateCustomFeatures(loc) {
    if (featuresManager.features.length === 0) return;
    
    let surfaceHeight = detectSurfaceFloor(this.dimension, loc, this.dimClass.terrainMaterials.topMaterial, -10, 100);
    
    try {
      const sampleLoc = { x: loc.x + 8, y: 256, z: loc.z + 8 };
      let checkY = 256;
      while (checkY > 0) {
        const block = this.dimension.getBlock({ x: sampleLoc.x, y: checkY, z: sampleLoc.z });
        if (block && !block.isAir) {
          surfaceHeight = checkY;
          break;
        }
        checkY--;
      }
    } catch (error) {
    }
    
    const generated = featuresManager.generateFeaturesForChunk(
      this.dimension, 
      this.dimClass, 
      loc, 
      surfaceHeight
    );
    
    if (generated > 0) {
      world.sendMessage(`§7Total de features geradas na chunk: ${generated}`);
    }
}

  _setChunkMaterials(loc) {
    this.dimension.placeFeatureRule("custom_dim:dirt_features", loc);
    this.dimension.placeFeatureRule("custom_dim:grass_features", loc);

    //muda os blocos da chunk se forem diferentes do default
    if (this.dimClass.terrainMaterials.topMaterial !== 'grass_block') {
      this.dimension.runCommand(
          `fill ${loc.x} ${loc.y - 32} ${loc.z} ` +
          `${loc.x + 15} ${loc.y + 32} ${loc.z + 15} ` +
          `${this.dimClass.terrainMaterials.topMaterial} replace grass_block`
      );
    }

    if (this.dimClass.terrainMaterials.midMaterial !== 'dirt') {
      this.dimension.runCommand(
          `fill ${loc.x} ${loc.y - 32} ${loc.z} ` +
          `${loc.x + 15} ${loc.y + 32} ${loc.z + 15} ` +
          `${this.dimClass.terrainMaterials.midMaterial} replace dirt`
      );
    }

    if (this.dimClass.terrainMaterials.bottomMaterial !== 'stone') {
      this.dimension.runCommand(
          `fill ${loc.x} ${loc.y - 64} ${loc.z} ` +
          `${loc.x + 15} ${loc.y} ${loc.z + 15} ` +
          `${this.dimClass.terrainMaterials.bottomMaterial} replace stone`
      );
    }

    if (this.dimClass.terrainMaterials.baseMaterial !== 'bedrock') {
      this.dimension.runCommand(
          `fill ${loc.x} ${loc.y - 64} ${loc.z} ` +
          `${loc.x + 15} ${loc.y - 25} ${loc.z + 15} ` +
          `${this.dimClass.terrainMaterials.baseMaterial} replace bedrock`
      );
    }
  }

  _generateOverChunk(loc) {
    //gera chunk base
    //CHUNK ALTA
    if (this.dimClass.VerticalChunkSize === VerticalChunkSize.HIGH) {
      this.dimension.placeFeatureRule("custom_dim:nether_chunk_base_high", loc);
      this.dimension.placeFeatureRule("custom_dim:nether_bedrock_features", loc);
    } 
    
    //CHUNK MEDIA
    else if (this.dimClass.VerticalChunkSize === VerticalChunkSize.MEDIUM) {
      this.dimension.placeFeatureRule("custom_dim:nether_chunk_base_medium", loc);
      this.dimension.placeFeatureRule("custom_dim:nether_medium_bedrock_features", loc);
    }

    //CHUNK BAIXA
    else if (this.dimClass.VerticalChunkSize === VerticalChunkSize.LOW) {
      this.dimension.placeFeatureRule("custom_dim:nether_chunk_base_low", loc);
      this.dimension.placeFeatureRule("custom_dim:nether_low_bedrock_features", loc);
    }

    //===GERA O RELEVO===//

    if (this.dimClass.reliefType === ReliefType.FLAT) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_flat", loc);
    } else if (this.dimClass.reliefType === ReliefType.HILLS) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_hills", loc);
    } else if (this.dimClass.reliefType === ReliefType.MOUNTAINS) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_mountains", loc);
    } else if (this.dimClass.reliefType === ReliefType.PLAINS) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_plains", loc);
    } else if (this.dimClass.reliefType === ReliefType.HILLS_WITH_RIVERS) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_hills_with_rivers", loc);
    } else if (this.dimClass.reliefType === ReliefType.ISLAND_CHAIN) {
      this.dimension.placeFeatureRule("custom_dim:nether_relief_island_chain", loc);
    } 
  }

  _generateBaseChunk(loc) {
    //gera chunk base
    //CHUNK ALTA
    if (this.dimClass.VerticalChunkSize === VerticalChunkSize.HIGH) {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_high", loc);
      this.dimension.placeFeatureRule("custom_dim:bedrock_features", loc);
      this.dimension.placeFeatureRule("custom_dim:deepslate_features", loc);
    } 
    
    //CHUNK MEDIA
    else if (this.dimClass.VerticalChunkSize === VerticalChunkSize.MEDIUM) {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_medium", loc);
      this.dimension.placeFeatureRule("custom_dim:medium_bedrock_features", loc);
    }

    //CHUNK BAIXA
    else if (this.dimClass.VerticalChunkSize === VerticalChunkSize.LOW) {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_low", loc);
      this.dimension.placeFeatureRule("custom_dim:low_bedrock_features", loc);
    }

    //===GERA O RELEVO===//

    if (this.dimClass.reliefType === ReliefType.FLAT) {
      this.dimension.placeFeatureRule("custom_dim:relief_flat", loc);
    } else if (this.dimClass.reliefType === ReliefType.HILLS) {
      this.dimension.placeFeatureRule("custom_dim:relief_hills", loc);
    } else if (this.dimClass.reliefType === ReliefType.MOUNTAINS) {
      this.dimension.placeFeatureRule("custom_dim:relief_mountains", loc);
    } else if (this.dimClass.reliefType === ReliefType.PLAINS) {
      this.dimension.placeFeatureRule("custom_dim:relief_plains", loc);
    } else if (this.dimClass.reliefType === ReliefType.HILLS_WITH_RIVERS) {
      this.dimension.placeFeatureRule("custom_dim:relief_hills_with_rivers", loc);
    } else if (this.dimClass.reliefType === ReliefType.ISLAND_CHAIN) {
      this.dimension.placeFeatureRule("custom_dim:relief_island_chain", loc);
    }  

    //gera features basicas da chunk
    if (this.dimClass.canGenerateCommonFeatures) {
      this.dimension.placeFeatureRule("custom_dim:andesite_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:diorite_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:dirt_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:granite_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:granite_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:gravel_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:extra_gravel_ore_feature", loc);
    }

    //gera minerios vanilla
    if (this.dimClass.canGenerateVanillaOres) {
      this.dimension.placeFeatureRule("custom_dim:redstone_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:lapis_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:iron_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:gold_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:diamond_ore_feature", loc);
      this.dimension.placeFeatureRule("custom_dim:coal_ore_feature", loc);
    }

    if (this.dimClass.canGenerateLakes) {
      this.dimension.placeFeatureRule("custom_dim:lake_feature", loc);
    }
  }
}
