import { world, system } from "@minecraft/server";

export class ChunkRingGenerator {
  constructor(location, maxChunks) {
    this.location = location;
    this.maxChunks = maxChunks;
    this.onChunkBehaviour = null;
    this.chunkSize = 16;
  }

  generateChunks() {
    try {
      if (typeof this.onChunkBehaviour != "function") return;

      let generated = 0;
      
      for (let i = 0; i <= this.maxChunks; i++) {
        system.runTimeout(() => {
          const chunkPos = this._getChunkPosition(i);
          this.onChunkBehaviour(chunkPos);
          //world.sendMessage(`Generated chunk ${i + 1}`);
        }, i * 5);
      }
    } catch (e) {
    }
  }

  _getChunkPosition(index) {
    const ring = Math.floor(Math.sqrt(index));
    const ringStart = ring * ring;
    const ringSize = ring * 2 + 1;
    const positionInRing = index - ringStart;
    
    const side = Math.floor(positionInRing / ringSize);
    const posOnSide = positionInRing % ringSize - ring;
    
    let dx = 0, dz = 0;
    
    switch(side) {
      case 0:
        dx = ring;
        dz = posOnSide;
        break;
      case 1:
        dx = -posOnSide;
        dz = ring;
        break;
      case 2:
        dx = -ring;
        dz = -posOnSide;
        break;
      case 3:
        dx = posOnSide;
        dz = -ring;
        break;
    }
    
    if (index === 0) {
      dx = 0;
      dz = 0;
    }
    
    return {
      x: this.location.x + dx * this.chunkSize,
      y: this.location.y,
      z: this.location.z + dz * this.chunkSize
    };
  }
}