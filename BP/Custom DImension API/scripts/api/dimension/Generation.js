import { world, system } from "@minecraft/server";
import { CustomDimensionManager } from "./CustomDimension.js";
import { generatePortal } from "./PortalGenerator.js";
import { ChunkGenerator } from "./ChunkGenerator.js"
import { ChunkBatcher } from './ChunkBatcher.js';

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe((e) => {
  const to = e.toDimension;
  const from = e.fromDimension;
  const toLoc = e.toLocation;
  const player = e.player;

  //==== QUANDO ENTRA EM UMA DIMENSAO CUSTOM ====//
  if (dimManager.getDimension(to.id)) {
    const dimClass = dimManager.getDimension(to.id);

    //gera as chunks fixas
    const chunkGen = new ChunkGenerator(to, dimClass);
    chunkGen.generateAllChunks();

    //chama função para quando entra na dimensao
    if (typeof dimClass.onEnters === "function") {
      dimClass.onEnters(to);
    }

    //aplica fog
    if (dimClass.dimensionFog !== "") {
        player.runCommand(
          `fog @s push "${dimClass.dimensionFog}" "${dimClass.namespace}"`,
        );
      }

    if (!world.getDynamicProperty(`${dimClass.namespace}_generated`)) {
      world.setDynamicProperty(`${dimClass.namespace}_generated`, true);

      //gera o portal
      if (dimClass.canGeneratePortal) {
        generatePortal(dimClass.namespace, toLoc, to);
      }

      //chama a funcao da primeia geração da dimensao
      if (typeof dimClass.onFirstGeneration === "function") {
        dimClass.onFirstGeneration(to);
      }
    }
  }
  //==== QUANDO SAI DA DIMENSAO CUSTOM ====//
  else if (dimManager.getDimension(from.id) && to.id === 'minecraft:overworld') {
    const dimClass = dimManager.getDimension(from.id);

    if (dimClass.dimensionFog !== "") {
      player.runCommand(`fog @s remove "${dimClass.namespace}"`);
    }

    //chama função para quando sai da dimensao
    if (typeof dimClass.onLeaves === "function") {
      dimClass.onLeaves(to);
    }
  }
});

world.afterEvents.entitySpawn.subscribe((e) => {
  try {
    const entity = e.entity;
    const dim = entity.dimension;

    if (dimManager.getDimension(dim.id)) {
      const dimClass = dimManager.getDimension(dim.id);
      if (!dimClass.canSpawnVanillaMobs && entity && entity.typeId.includes('minecraft')) {
        entity.teleport({x: 999999, y: 999999, z: 999999})
      }
    }
  } catch (e) {}
});

world.afterEvents.itemUse.subscribe((e) => {
  const dim = e.source.dimension;
  const item = e.itemStack;

  if (item.typeId === "minecraft:bow") {
    const dimClass = dimManager.getDimension('custom_dim:dimension_1')
    const chunkGen = new ChunkGenerator(dim, dimClass);
    chunkGen.generateAllChunks();
  }
});
