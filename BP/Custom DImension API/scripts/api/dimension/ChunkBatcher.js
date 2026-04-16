export class ChunkBatcher {
    constructor(location, maxChunks) {
        this.location = location;
        this.maxChunks = maxChunks;
        this.onChunkBehaviour = null;
    }

    batchChunks() {
        const chunkPositions = this._generateChunkPositions();

        if (typeof this.onChunkBehaviour != "function") return;

        for (let i = 0; i <= this.maxChunks; i++) {
            const x = chunkPositions[i][0];
            const y = chunkPositions[i][1];
            const z = chunkPositions[i][2];
            const chunkLoc = { x: x, y: y, z: z };
            this.onChunkBehaviour(chunkLoc);
        }
    }

    _generateChunkPositions() {
        const chunkPositions = [];
        const chunkSize = 16;

        let generatedPos = 0;

        for (let radius = 0; radius <= this.maxChunks; radius++) {
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    if (Math.abs(dx) === radius || Math.abs(dz) === radius) {
                        const x = this.location.x + dx * chunkSize;
                        const y = this.location.y;
                        const z = this.location.z + dz * chunkSize;

                        chunkPositions[generatedPos] = [x, y, z];
                        generatedPos++;
                    }
                }
            }
        }

        return chunkPositions;
    }
}