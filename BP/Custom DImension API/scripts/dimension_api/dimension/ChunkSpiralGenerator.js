import { world, system } from "@minecraft/server";

export class ChunkSpiralGenerator {
  constructor(location, maxChunks) {
    this.location = location;
    this.maxChunks = maxChunks;
    this.onChunkBehaviour = null;
    this.chunkSize = 16;
    this.chunksGenerated = 0;
    this.chunkPositions = this._generateChunkPositions();
  }

  generateChunks() {
    try {
      if (typeof this.onChunkBehaviour != "function") return;

      for (let i = this.chunksGenerated; i <= this.maxChunks; i++) {
        system.runTimeout(() => {
          world.sendMessage(`Chunk ${i} gerada.`);
          const x = this.chunkPositions[i][0];
          const y = this.chunkPositions[i][1];
          const z = this.chunkPositions[i][2];
          const chunkLoc = { x: x, y: y, z: z };
          this.onChunkBehaviour(chunkLoc);
        }, i * 5);
      }
    } catch (e) {}
  }

  _generateChunkPositions() {
    const chunkPositions = [];

    let generatedPos = 0;

    for (let radius = 0; radius <= this.maxChunks; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.abs(dx) === radius || Math.abs(dz) === radius) {
            const x = this.location.x + dx * this.chunkSize;
            const y = this.location.y;
            const z = this.location.z + dz * this.chunkSize;

            chunkPositions[generatedPos] = [x, y, z];
            generatedPos++;
          }
        }
      }
    }

    return chunkPositions;
  }
}
