import { world } from '@minecraft/server';
import { detectBlocks, fillPortalBlocks, fillPortalBlocksWithDir } from './Utils.js'
import { CustomPortalManager, PortalType } from './CustomPortal.js';

world.afterEvents.itemUseOn.subscribe((event) => {
    const item = event.itemStack;
    const blockLocation = event.block.location;
    const dimension = world.getDimension('overworld');
    const portalManager = new CustomPortalManager();

    portalManager.portals.forEach(portal => {
        if (portal.type == PortalType.NETHER) {
            if (item.typeId == portal.lightWithItem) {
                const block = dimension.getBlock(blockLocation);
        
                if (block.typeId == portal.frameBlock) {
                    //detect portal direction and down blocks
                    if (checkDirection(portal.frameBlock, -1, 1, 0, 1, 0, 0, blockLocation, dimension)) {
                        createPortal1(portal.frameBlock, portal.portalBlock, blockLocation, dimension);
                        lightning(portal, dimension);
                        return;
                    } else if (checkDirection(portal.frameBlock, 0, 0, 0, 1, -1, 1, blockLocation, dimension)) {
                        createPortal2(portal.frameBlock, portal.portalBlock, blockLocation, dimension);
                        lightning(portal, dimension);
                        return;
                    }
                }
            }
        }
    });
});

function lightning(portal, dimension) {
    if (portal.hasLightning) {
        dimension.spawnEntity('minecraft:lightning_bolt', blockLocation);
    }
}

function checkDirection(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension) {
    let blocksDetected = detectBlocks(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension);

    if (blocksDetected >= 3) {
        return true;
    }

    return false;
}

function createPortal1(frameBlock, portalBlock, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(frameBlock, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(frameBlock, -1, -1, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(frameBlock, 2, 2, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, portalBlock, -1, 1, 0, 1, 3, 0);
    } else if (detectBlocks(frameBlock, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(frameBlock, -2, -2, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(frameBlock, 1, 1, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, portalBlock, -1, 1, 0, 1, 3, 0);
    }

    return;
}

function createPortal2(frameBlock, portalBlock, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(frameBlock, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(frameBlock, 0, 0, 1, 3, -1, -1, blockLocation, dimension) == 3 &&
        detectBlocks(frameBlock, 0, 0, 1, 3, 2, 2, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, portalBlock, 0, 1, -1, 0, 3, 1, 'west');
    } else if (detectBlocks(frameBlock, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(frameBlock, 0, 0, 1, 3, -2, -2, blockLocation, dimension) == 3 &&
        detectBlocks(frameBlock, 0, 0, 1, 3, 1, 1, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, portalBlock, 0, 1, -1, 0, 3, 1, 'west');
    }

    return;
}
