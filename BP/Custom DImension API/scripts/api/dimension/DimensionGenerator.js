import { system, world } from '@minecraft/server';
import { CustomDimensionManager } from './CustomDimension.js';
import { GenerateNetherPortal, GenerateTheEndPortal } from './PortalGenerator.js';
import { CustomPortalManager, PortalType } from '../portal/CustomPortal.js';

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe(e => {
    const to = e.toDimension;
    if (dimManager.getDimension(to.id)) {
        const dimClass = dimManager.getDimension(to.id);
        generatePortal(dimClass.namespace, e.toLocation, to);
    }
})

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

