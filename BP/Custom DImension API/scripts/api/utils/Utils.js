const replaceableBlocks = ['air', 'fire', 'water', 'lava', 'flowing_water', 'flowing_lava'];

export function detectBlocks(blockType, xMin, xMax, yMin, yMax, zMin, zMax, entryLoc, dimension) {
    let blocksDetected = 0;

    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            for (let z = zMin; z <= zMax; z++) {
                const blockLoc = { x: entryLoc.x + x, y: entryLoc.y + y, z: entryLoc.z + z };
                const block = dimension.getBlock(blockLoc);

                if (block && block.typeId == blockType) {
                    blocksDetected++;
                }
            }
        }
    }

    return blocksDetected;
}

export function placeBlocks(block, xMin, xMax, yMin, yMax, zMin, zMax, entryLoc, dimension) {
    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            for (let z = zMin; z <= zMax; z++) {
                const blockLoc = { x: entryLoc.x + x, y: entryLoc.y + y, z: entryLoc.z + z };
                dimension.setBlockType(blockLoc, block);
            }
        }
    }
}

function replaceBlocks(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2, replacements, extra = '') {
    replacements.forEach(replaceBlock => {
        dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} ${extra} replace ${replaceBlock}`);
    });
}

export function fillPortalBlocks(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2) {
    replaceBlocks(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2, replaceableBlocks);
}

export function fillPortalBlocksWithDir(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2, direction) {
    const extra = `["minecraft:facing_direction"="${direction}"]`;
    replaceBlocks(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2, replaceableBlocks, extra);
}

export function fillPortalBlocksSmart(blockToFill, interruptBlock, dimension, entryLoc, xMin, xMax, yMin, yMax, zMin, zMax) {
    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            for (let z = zMin; z <= zMax; z++) {
                const blockLoc = { x: entryLoc.x + x, y: entryLoc.y + y, z: entryLoc.z + z };
                const block = dimension.getBlock(blockLoc);

                if (block && block.typeId == 'minecraft:air') {
                    dimension.setBlockType(blockLoc, blockToFill);
                } else if (block && block.typeId == interruptBlock) {
                    break;
                }
            }
        }
    }
}

export function generateRandomSeed() {
    return Math.floor(Math.random() * (2 ** 32)) - 2 ** 31;
}
