import { world, system } from "@minecraft/server";
import { CustomDimensionManager } from "./CustomDimension.js";
import { generatePortal } from "./PortalGenerator.js";

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe((e) => {
  const to = e.toDimension;
  const toLoc = e.toLocation;

  if (dimManager.getDimension(to.id)) {
    const dimClass = dimManager.getDimension(to.id);

    generateDimChunk(to, dimClass);

    //gera o portal
    if (dimClass.canGeneratePortal) {
      generatePortal(dimClass.namespace, toLoc, to);
    }

    if (!world.getDynamicProperty(`${dimClass.namespace}_generated`)) {
      world.setDynamicProperty(`${dimClass.namespace}_generated`, true);

      //chama a funcao da primeia geração da dimensao
      if (typeof dimClass.onFirstGeneration === "function") {
        dimClass.onFirstGeneration(to);
      }
    }
  }
});

world.afterEvents.itemUse.subscribe((e) => {
  const dim = e.source.dimension;
  const item = e.itemStack;
  const loc = e.source.location;

  if (item.typeId === "minecraft:bow") {
    generateDimChunk(dim, dimManager.getDimension('custom_dim:dimension_1'));
  }
});

function generateDimChunk(dimension, dimClass) {
  if (!dimClass.canGenerateTerrain) return;
  const loc = dimClass.spawnLoc;

  //gera chunk base
  dimension.placeFeatureRule("custom_dim:stone_column", loc);
  dimension.placeFeatureRule("custom_dim:bedrock_features", loc);
  dimension.placeFeatureRule("custom_dim:deepslate_features", loc);
  dimension.placeFeatureRule("custom_dim:dirt_features", loc);
  dimension.placeFeatureRule("custom_dim:grass_features", loc);

  //gera features basicas da chunk
  dimension.placeFeatureRule("custom_dim:andesite_feature", loc);
  dimension.placeFeatureRule("custom_dim:diorite_feature", loc);
  dimension.placeFeatureRule("custom_dim:dirt_feature", loc);
  dimension.placeFeatureRule("custom_dim:granite_feature", loc);
  dimension.placeFeatureRule("custom_dim:granite_feature", loc);
  dimension.placeFeatureRule("custom_dim:gravel_ore_feature", loc);
  dimension.placeFeatureRule("custom_dim:extra_gravel_ore_feature", loc);

  if (dimClass.canGenerateVanillaOres) {
    dimension.placeFeatureRule("custom_dim:redstone_ore_feature", loc);
    dimension.placeFeatureRule("custom_dim:lapis_ore_feature", loc);
    dimension.placeFeatureRule("custom_dim:iron_ore_feature", loc);
    dimension.placeFeatureRule("custom_dim:gold_ore_feature", loc);
    dimension.placeFeatureRule("custom_dim:diamond_ore_feature", loc);
    dimension.placeFeatureRule("custom_dim:coal_ore_feature", loc);
  }

  dimension.runCommand(`tickingarea add circle ${loc.x} ${loc.y} ${loc.z} 4 temp`);
  dimension.runCommand(`tickingarea remove temp`);
  const block = dimension.getBlock(loc);
block.setPermutation(block.permutation);
}
