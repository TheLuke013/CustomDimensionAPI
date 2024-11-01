import { system, world } from '@minecraft/server';
import { ChunkGenerator } from './ChunkGenerator.js';
import { CustomDimensionManager } from './CustomDimension.js';

let generatedChunks = 0;

system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');
    const dimManager = new CustomDimensionManager();

    player.forEach(player => {
        dimManager.dimensions.forEach(dim => {
            if (player.getTags() == `generate_dimension_${dim.namespace}`) {
                player.addTag(`generate_${dim.namespace}`);
                player.removeTag(`generate_dimension_${dim.namespace}`);
            }

            if (player.getTags() == `generate_${dim.namespace}` && generatedChunks < dim.maxChunks) {
                generateDimChunk(dimension, dim);
            }

            if (generatedChunks >= dim.maxChunks) {
                player.playSound('portal.travel');
                player.removeTag(`generate_${dim.namespace}`);
                generatedChunks = 0;
            }
        });
    });
});

function generateDimChunk(overworldDim, dimension) {
    world.sendMessage(`Chunks geradas: ${generatedChunks}`);
    const mat = dimension.terrainMaterials;
    const generator = new ChunkGenerator(16, 64, dimension.seed, 0.02);
    const chunkPositions = generateChunkPositions(dimension.location);

    generator.generate(
        chunkPositions[generatedChunks][0],
        chunkPositions[generatedChunks][2],
        chunkPositions[generatedChunks][1],
        overworldDim, mat.topMaterial, mat.midMaterial, mat.bottomMaterial, mat.baseMaterial);

    generatedChunks++;
}

function generateChunkPositions(dimLocation) {
    const chunkPositions = [
        [dimLocation.x, dimLocation.z, dimLocation.y],
        [dimLocation.x + 17, dimLocation.z + 17, dimLocation.y],
        [dimLocation.x + 17, dimLocation.z - 17, dimLocation.y],
        [dimLocation.x - 17, dimLocation.z + 17, dimLocation.y],
        [dimLocation.x, dimLocation.z + 17, dimLocation.y],
        [dimLocation.x + 17, dimLocation.z, dimLocation.y],
        [dimLocation.x - 17, dimLocation.z - 17, dimLocation.y],
        [dimLocation.x, dimLocation.z - 17, dimLocation.y],
        [dimLocation.x - 17, dimLocation.z, dimLocation.y]
    ];

    return chunkPositions; 
}