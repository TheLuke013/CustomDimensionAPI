import { system, world } from '@minecraft/server';
import { ChunkGenerator } from './ChunkGenerator.js';
import { CustomDimensionManager } from './CustomDimension.js';
import { GenerateNetherPortal, GenerateTheEndPortal } from './PortalGenerator.js';
import { CustomPortalManager, PortalType } from '../portal/CustomPortal.js';

let generator = new ChunkGenerator(16, 16, 0, 0);

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

            if (player.getTags().includes(`generate_${dim.namespace}`) && dim.generatedChunks == 1) {
                generatePortal(dim.namespace, dim.location, dimension);
                player.playSound('portal.travel');
            }

            if (dim.generatedChunks >= dim.maxChunks) {
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

function generatePortal(dimNamespace, location, dimension) {
    const portalManager = new CustomPortalManager();
    const portalLoc = { x: location.x + 1, y: location.y - 1, z: location.z + 1 };

    portalManager.portals.forEach(portal => {
        if (portal.destDimID == dimNamespace) {
            if (portal.type == PortalType.NETHER) {
                GenerateNetherPortal(portal.portalBlock, portal.frameBlock, portalLoc, dimension);
            } else if (portal.type == PortalType.THE_END) {
                GenerateTheEndPortal(portal.portalBlock, portal.frameBlock, portalLoc, dimension);
            }
        }
    });
}

function generateDimChunk(overworldDim, dimension) {
    //configure generator
    generator.seed = dimension.seed;
    generator.frequency = dimension.frequency;

    //generate and get chunk positions
    if (!dimension.chunkPosGenerated) {
        dimension.chunkPositions = generateChunkPositions(dimension);
        dimension.chunkPosGenerate = true;
    }

    generator.generate(overworldDim, dimension);
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

