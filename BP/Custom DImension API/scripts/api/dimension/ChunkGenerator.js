import { ChunkBatcher } from './ChunkBatcher.js';

export class ChunkGenerator {
  constructor(dimension, dimClass) {
    this.dimension = dimension;
    this.dimClass = dimClass;
    this.chunkBatcher = new ChunkBatcher(dimClass.spawnLoc, dimClass.maxChunks);
  }

  generateAllChunks() {
    this.chunkBatcher.onChunkBehaviour = (chunkLoc) => {
      this.generateChunk(chunkLoc);
      if (typeof this.dimClass.onChunkGeneration === "function") {
        this.dimClass.onChunkGeneration(this.dimension, chunkLoc);
      }
    };

    this.chunkBatcher.batchChunks();
  }

  generateChunk(loc) {
    if (!this.dimClass.canGenerateTerrain) return;

    //gera chunk base
    //CHUNK ALTA
    if (this.dimClass.VerticalChunkSize === 'high') {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_high", loc);
      this.dimension.placeFeatureRule("custom_dim:bedrock_features", loc);
      this.dimension.placeFeatureRule("custom_dim:deepslate_features", loc);
    } 
    
    //CHUNK MEDIA
    else if (this.dimClass.VerticalChunkSize === 'medium') {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_medium", loc);
      this.dimension.placeFeatureRule("custom_dim:medium_bedrock_features", loc);
    }

    //CHUNK BAIXA
    else if (this.dimClass.VerticalChunkSize === 'low') {
      this.dimension.placeFeatureRule("custom_dim:chunk_base_low", loc);
      this.dimension.placeFeatureRule("custom_dim:low_bedrock_features", loc);
    }

    this.dimension.placeFeatureRule("custom_dim:dirt_features", loc);
    this.dimension.placeFeatureRule("custom_dim:grass_features", loc);

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

    this.dimension.runCommand(`tickingarea add circle ${loc.x} ${loc.y} ${loc.z} 4 temp`);
    this.dimension.runCommand(`tickingarea remove temp`);
  }
}
