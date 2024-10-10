import { world } from '@minecraft/server';
import { detectBlocks, fillPortalBlocks, fillPortalBlocksWithDir } from './Utils.js'

world.afterEvents.itemUseOn.subscribe((event) => {
    const item = event.itemStack;
    const blockLocation = event.block.location;
    const dimension = world.getDimension('overworld');
    const blockType = 'minecraft:mossy_cobblestone';

    if (item.typeId == 'minecraft:flint_and_steel') {
        const block = dimension.getBlock(blockLocation);

        if (block.typeId == blockType) {
            //detect portal direction and down blocks
            if (checkDirection(blockType, -1, 1, 0, 1, 0, 0, blockLocation, dimension)) {
                createPortal1(blockType, blockLocation, dimension);
                return;
            } else if (checkDirection(blockType, 0, 0, 0, 1, -1, 1, blockLocation, dimension)) {
                createPortal2(blockType, blockLocation, dimension);
                return;
            }
        }
    }
});

function checkDirection(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension) {
    let blocksDetected = detectBlocks(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension);

    if (blocksDetected >= 3) {
        return true;
    }

    return false;
}

function createPortal1(blockType, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(blockType, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(blockType, -1, -1, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(blockType, 2, 2, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, '013:portal_block_1', -1, 1, 0, 1, 3, 0);
    } else if (detectBlocks(blockType, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(blockType, -2, -2, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(blockType, 1, 1, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, '013:portal_block_1', -1, 1, 0, 1, 3, 0);
    }

    return;
}

function createPortal2(blockType, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(blockType, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(blockType, 0, 0, 1, 3, -1, -1, blockLocation, dimension) == 3 &&
        detectBlocks(blockType, 0, 0, 1, 3, 2, 2, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, '013:portal_block_1', 0, 1, -1, 0, 3, 1, 'west');
    } else if (detectBlocks(blockType, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(blockType, 0, 0, 1, 3, -2, -2, blockLocation, dimension) == 3 &&
        detectBlocks(blockType, 0, 0, 1, 3, 1, 1, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, '013:portal_block_1', 0, 1, -1, 0, 3, 1, 'west');
    }

    return;
}
