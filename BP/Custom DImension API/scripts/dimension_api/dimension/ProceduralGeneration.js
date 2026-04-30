import { system, world } from "@minecraft/server";
import { CustomDimensionManager, GenerationType, VerticalChunkSize } from "./CustomDimension.js";
import { detectSurfaceFloor } from "../utils/Utils.js";
import { ChunkGenerator } from "./ChunkGenerator.js"

const dimManager = new CustomDimensionManager();

function hasChunkBase(dim, dimClass, pos) {
    let baseY = 0;

    if (dimClass.VerticalChunkSize === VerticalChunkSize.LOW) {
        baseY = 32;
    } else if (dimClass.VerticalChunkSize === VerticalChunkSize.HIGH) {
        baseY = -64;
    }

    const baseBlock = dim.getBlock({ x: pos.x, y: baseY, z: pos.z });
    if (baseBlock && baseBlock.typeId === "minecraft:air") {
        return false;
    }

    return true;
}

system.runInterval(() => {
  const players = world.getPlayers();

  players.forEach(player => {
    const dimension = player.dimension;
    const dimClass = dimManager.getDimension(dimension.id);
    if (dimClass && dimClass.generationType === GenerationType.DYNAMIC) {
      const playerPos = player.location;
      const hasChunk = hasChunkBase(dimension, dimClass, playerPos);

      if (!hasChunk) {
        world.sendMessage(`Generating chunk for ${player.name}...`);
        const chunkGen = new ChunkGenerator(dimension, dimClass);
        //chunkGen.generateChunk({ x: playerPos.x, y: 0, z: playerPos.z });
        chunkGen.chunkSpiralGenerator.maxChunks = 5;
        chunkGen.chunkSpiralGenerator.location = playerPos;
        chunkGen.chunkSpiralGenerator._generateChunkPositions();
        chunkGen.generateAllChunks();
      }
    }
  });
}, 1);