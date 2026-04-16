import { world, system } from "@minecraft/server";
import { CustomDimensionManager } from "./CustomDimension.js";
import { generatePortal } from "./PortalGenerator.js";
import { ChunkGenerator } from "./ChunkGenerator.js"
import { ChunkBatcher } from './ChunkBatcher.js';

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe((e) => {
  const to = e.toDimension;
  const toLoc = e.toLocation;

  if (dimManager.getDimension(to.id)) {
    const dimClass = dimManager.getDimension(to.id);

    const chunkGen = new ChunkGenerator(to, dimClass);
    chunkGen.generateAllChunks();

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
});

world.afterEvents.itemUse.subscribe((e) => {
  const dim = e.source.dimension;
  const item = e.itemStack;

  if (item.typeId === "minecraft:bow") {
    const dimClass = dimManager.getDimension('custom_dim:dimension_1')
    const chunkGen = new ChunkGenerator(dim, dimClass);
    chunkGen.generateAllChunks();
    /*const chunkBatcher = new ChunkBatcher(dimClass.spawnLoc, dimClass.maxChunks);
    chunkBatcher.onChunkBehaviour = (chunkLoc) => {
      const l = { x: chunkLoc.x, y: chunkLoc.y, z: chunkLoc.z };
      chunkGen.generateChunk(l);
    };

    chunkBatcher.batchChunks();*/
  }
});
