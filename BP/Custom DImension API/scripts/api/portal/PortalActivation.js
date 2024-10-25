import { world } from '@minecraft/server';
import { detectBlocks, fillPortalBlocks, fillPortalBlocksWithDir, placeBlocks, placeBlocks2 } from './Utils.js'
import { CustomPortalManager, PortalType } from './CustomPortal.js';

world.afterEvents.itemUseOn.subscribe((event) => {
    const item = event.itemStack;
    const blockLocation = event.block.location;
    const dimension = world.getDimension('overworld');
    const portalManager = new CustomPortalManager();

    portalManager.portals.forEach(portal => {
        //NETHER TYPE
        dimension.setBlockType
        if (portal.type == PortalType.NETHER) {
            if (item.typeId == portal.lightWithItem) {
                const block = dimension.getBlock(blockLocation);

                if (block.typeId == portal.frameBlock) {
                    //detect portal direction and down blocks
                    if (detectPortal(portal.frameBlock, -1, 1, 0, 1, 0, 0, blockLocation, dimension)) {
                        createNetherPortal1(portal, blockLocation, dimension);
                        return;
                    } else if (detectPortal(portal.frameBlock, 0, 0, 0, 1, -1, 1, blockLocation, dimension)) {
                        createNetherPortal2(portal, blockLocation, dimension);
                        return;
                    }
                }
            }
        }

        //END TYPE
        else if (portal.type == PortalType.THE_END) {
            if (item.typeId == portal.lightWithItem) {
                const block = dimension.getBlock(blockLocation);

                if (block.typeId == portal.frameBlock) {
                    if (detectPortal(portal.frameBlock, -2, 2, 0, 0, 0, 0, blockLocation, dimension)) {
                        createEndPortal1(portal, blockLocation, dimension);
                        //fillPortalBlocks(dimension, blockLocation, portal.portalBlock, -1, 0, 1, 1, 0, 3);
                        return;
                    } else if (detectPortal(portal.frameBlock, 0, 0, 0, 0, -2, 2, blockLocation, dimension)) {
                        createEndPortal2(portal, blockLocation, dimension);
                    }
                }
            }
        }
    });
});

function lightning(portal, dimension, location) {
    if (portal.hasLightning) {
        dimension.spawnEntity('minecraft:lightning_bolt', location);
    }
}

function detectPortal(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension) {
    let blocksDetected = detectBlocks(blockType, xMin, xMax, yMin, yMax, zMin, zMax, blockLocation, dimension);

    if (blocksDetected >= 3) {
        return true;
    }

    return false;
}

function createNetherPortal1(portal, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(portal.frameBlock, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(portal.frameBlock, -1, -1, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, 2, 2, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, -1, 1, 0, 1, 3, 0);
        lightning(portal, dimension, blockLocation);
    } else if (detectBlocks(portal.frameBlock, 0, 1, 4, 4, 0, 0, blockLocation, dimension) == 2 &&
        detectBlocks(portal.frameBlock, -2, -2, 1, 3, 0, 0, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, 1, 1, 1, 3, 0, 0, blockLocation, dimension) == 3) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, -1, 1, 0, 1, 3, 0);
        lightning(portal, dimension, blockLocation);
    }

    return;
}

function createNetherPortal2(portal, blockLocation, dimension) {
    //detect portal structure
    if (detectBlocks(portal.frameBlock, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(portal.frameBlock, 0, 0, 1, 3, -1, -1, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, 0, 0, 1, 3, 2, 2, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, portal.portalBlock, 0, 1, -1, 0, 3, 1, 'west');
    } else if (detectBlocks(portal.frameBlock, 0, 0, 4, 4, 0, 1, blockLocation, dimension) == 2 &&
        detectBlocks(portal.frameBlock, 0, 0, 1, 3, -2, -2, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, 0, 0, 1, 3, 1, 1, blockLocation, dimension) == 3) {
        fillPortalBlocksWithDir(dimension, blockLocation, portal.portalBlock, 0, 1, -1, 0, 3, 1, 'west');
    }

    return;
}

function createEndPortal1(portal, blockLocation, dimension) {
    world.sendMessage('direcao 1');
    if (detectBlocks(portal.frameBlock, -2, 2, 0, 0, 4, 4, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, -3, 3, 0, 0, 1, 3, blockLocation, dimension) == 6) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, 1, 0, 0, 3, 0, 3);
        world.sendMessage('direcao 1: lado esquerdo');
    } else if (detectBlocks(portal.frameBlock, -2, 2, 0, 0, -4, -4, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, -3, 3, 0, 0, -3, -1, blockLocation, dimension) == 6) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, 0, 0, 0, -3, 0, 2);
        world.sendMessage('direcao 1: lado direito');
    } else {
        return;
    }

    lightning(portal, dimension, blockLocation);
    dimension.playSound(portal.portalActivationSound, blockLocation);
}

function createEndPortal2(portal, blockLocation, dimension) {
    world.sendMessage('direcao 2');
    if (detectBlocks(portal.frameBlock, 4, 4, 0, 0, -2, 2, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, 1, 3, 0, 0, -3, 3, blockLocation, dimension) == 6) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, 1, 0, 0, 3, 0, 3);
        world.sendMessage('direcao 2: lado esquerdo');
    } else if (detectBlocks(portal.frameBlock, -4, -4, 0, 0, -2, 2, blockLocation, dimension) == 3 &&
        detectBlocks(portal.frameBlock, -3, -1, 0, 0, -3, 3, blockLocation, dimension) == 6) {
        fillPortalBlocks(dimension, blockLocation, portal.portalBlock, 0, 0, 0, -3, 0, 2);
        world.sendMessage('direcao 2: lado direito');
    } else {
        return;
    }

    lightning(portal, dimension, blockLocation);
    dimension.playSound(portal.portalActivationSound, blockLocation);
}