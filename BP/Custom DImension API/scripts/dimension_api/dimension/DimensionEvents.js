import { world, system } from "@minecraft/server";
import { CustomDimensionManager, GenerationType } from "./CustomDimension.js";
import { generatePortal } from "./PortalGenerator.js";
import { ChunkGenerator } from "./ChunkGenerator.js"
import { detectSurfaceFloor } from "../utils/Utils.js";

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe((e) => {
  const to = e.toDimension;
  const from = e.fromDimension;
  const toLoc = e.toLocation;
  const player = e.player;

  //==== QUANDO ENTRA EM UMA DIMENSAO CUSTOM ====//
  if (dimManager.getDimension(to.id)) {
    const dimClass = dimManager.getDimension(to.id);
    const chunkGen = new ChunkGenerator(to, dimClass);

    //chama função para quando entra na dimensao
    if (typeof dimClass.onEnters === "function") {
      dimClass.onEnters(to, player);
    }

    //aplica fog
    if (dimClass.dimensionFog !== "") {
        player.runCommand(
          `fog @s push "${dimClass.dimensionFog}" "${dimClass.namespace}"`,
        );
      }

    const dimGenerated = world.getDynamicProperty(`${dimClass.namespace}_generated`);
    
    //gera a chunk onde o jogador spawnou
    if (!dimGenerated) chunkGen.generateChunk(toLoc);

    //teleporta jogador para altura de spawn da dimensao
    const delay = dimGenerated ? 5 : 20;
    system.runTimeout(() => {
      const height = detectSurfaceFloor(to, toLoc, dimClass.terrainMaterials.topMaterial, -10, 100);
      player.teleport({ x: toLoc.x, y: height, z: toLoc.z }, { dimension: to });
    }, delay);

    //quando a dimensao gera pela primeira vez
    if (!dimGenerated) {
      world.setDynamicProperty(`${dimClass.namespace}_generated`, true);

      //gera as chunks fixas
      if (dimClass.generationType === GenerationType.FIXED) {    
        chunkGen.generateAllChunks();
      }

      //gera o portal
      if (dimClass.canGeneratePortal) {
        system.runTimeout(() => { generatePortal(dimClass.namespace, toLoc, to); }, 100);
      }

      //chama a funcao da primeia geração da dimensao
      if (typeof dimClass.onFirstGeneration === "function") {
        dimClass.onFirstGeneration(to, player);
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
      dimClass.onLeaves(to, player);
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
