import { system, world } from '@minecraft/server';
import { CustomDimensionManager } from './CustomDimension.js';
import { GenerateNetherPortal, GenerateTheEndPortal } from './PortalGenerator.js';
import { CustomPortalManager, PortalType } from '../portal/CustomPortal.js';

const dimManager = new CustomDimensionManager();

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    dimManager.dimensions.forEach(dim => {
        dim.generateChunksData();
    });
});

system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');

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
    let chunk = dimension.chunks[dimension.generatedChunks];
    chunk.blocks.forEach(block => {
        const blockLoc = { x: block.x, y: block.y, z: block.z };
        overworldDim.setBlockType(blockLoc, block.namespace);
    });

    dimension.generatedChunks++;
    world.sendMessage(`Chunk generated: ${dimension.generatedChunks}`);
}

