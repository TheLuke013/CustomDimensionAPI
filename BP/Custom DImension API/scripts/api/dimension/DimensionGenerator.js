import { system, world } from '@minecraft/server';
import { ChunkGenerator } from './ChunkGenerator.js';
import { CustomDimensionManager } from './CustomDimension.js';

system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');
    const dimManager = new CustomDimensionManager();

    player.forEach(player => {
        dimManager.dimensions.forEach(dim => {
            if (player.getTags().includes(`generate_dimension_${dim.namespace}`)) {
                player.addTag(`generate_${dim.namespace}`);
                player.removeTag(`generate_dimension_${dim.namespace}`);
            }

            if (player.getTags().includes(`generate_${dim.namespace}`) && dim.generatedChunks < dim.maxChunks) {
                generateDimChunk(dimension, dim);
            }

            if (dim.generatedChunks >= dim.maxChunks) {
                player.playSound('portal.travel');
                player.removeTag(`generate_${dim.namespace}`);
                player.addTag(`${dim.namespace}_generated`);
                dim.generatedChunks = 0;
                dim.terrainGenerated = true;
            }

            if (dim.terrainGenerated) {
                player.addTag(`${dim.namespace}_generated`);
            } else if (player.getTags().includes(`${dim.namespace}_generated`)) {
                dim.terrainGenerated = true;
            }
        });
    });
});

function generateDimChunk(overworldDim, dimension) {
    world.sendMessage(`Chunks geradas: ${dimension.generatedChunks}`);
    const mat = dimension.terrainMaterials;
    const generator = new ChunkGenerator(16, 64, dimension.seed, 0.02);
    const chunkPositions = generateChunkPositions(dimension);

    generator.generate(
        chunkPositions[dimension.generatedChunks][0],
        chunkPositions[dimension.generatedChunks][1],
        chunkPositions[dimension.generatedChunks][2],
        overworldDim, mat.topMaterial, mat.midMaterial, mat.bottomMaterial, mat.baseMaterial);

    dimension.generatedChunks++;
}

function generateChunkPositions(dimension) {
    const chunkPositions = [];
    const dimLoc = dimension.location;
    const maxRadius = dimension.maxChunks;
    const chunkSize = 16;

    let generatedPos = 0;

    for (let radius = 0; radius <= maxRadius; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (Math.abs(dx) === radius || Math.abs(dz) === radius) {
                    const x = dimLoc.x + dx * chunkSize;
                    const y = dimLoc.y;
                    const z = dimLoc.z + dz * chunkSize;

                    chunkPositions[generatedPos] = [x, y, z];
                    generatedPos++;
                }
            }
        }
    }

    return chunkPositions;
}

