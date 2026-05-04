import { system } from "@minecraft/server";

export class ChunkRingGenerator {
  constructor(location, maxChunks) {
    this.location = location;
    this.maxChunks = maxChunks;
    this.onChunkBehaviour = null;
    this.chunkSize = 16;
    this.positions = null; // Cache das posições
  }

  generateChunks(predefinedPositions = null) {
    try {
      if (typeof this.onChunkBehaviour != "function") return;
      
      // PRÉ-CALCULA UMA ÚNICA VEZ
      if (predefinedPositions) {
        this.positions = predefinedPositions;
      } else {
        this.positions = this._generateSpiralPositions();
      }
      
      // Apenas itera sobre as posições pré-calculadas
      for (let i = 0; i <= this.maxChunks && i < this.positions.length; i++) {
        system.runTimeout(() => {
          this.onChunkBehaviour(this.positions[i]);
        }, i * 5);
      }
    } catch (e) {
      console.warn("Erro:", e);
    }
  }

  _generateSpiralPositions() {
    const positions = [{ x: 0, z: 0 }]; // Centro
    
    for (let step = 1; positions.length <= this.maxChunks; step++) {
      // Direita
      for (let i = 0; i < step && positions.length <= this.maxChunks; i++) {
        const last = positions[positions.length - 1];
        positions.push({ x: last.x + this.chunkSize, z: last.z });
      }
      // Cima
      for (let i = 0; i < step && positions.length <= this.maxChunks; i++) {
        const last = positions[positions.length - 1];
        positions.push({ x: last.x, z: last.z - this.chunkSize });
      }
      step++;
      // Esquerda
      for (let i = 0; i < step && positions.length <= this.maxChunks; i++) {
        const last = positions[positions.length - 1];
        positions.push({ x: last.x - this.chunkSize, z: last.z });
      }
      // Baixo
      for (let i = 0; i < step && positions.length <= this.maxChunks; i++) {
        const last = positions[positions.length - 1];
        positions.push({ x: last.x, z: last.z + this.chunkSize });
      }
    }
    
    // Converte para coordenadas reais do mundo
    return positions.map(pos => ({
      x: this.location.x + pos.x,
      y: this.location.y,
      z: this.location.z + pos.z
    }));
  }
}