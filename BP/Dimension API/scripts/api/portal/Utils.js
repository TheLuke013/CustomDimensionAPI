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

export function fillPortalBlocks(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2) {
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} replace air`);
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} replace fire`);
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} replace water`);
}

export function fillPortalBlocksWithDir(dimension, blockLocation, blockToFill, x1, y1, z1, x2, y2, z2, direction) {
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} ["minecraft:facing_direction"="${direction}"] replace air`);
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} ["minecraft:facing_direction"="${direction}"] replace fire`);
    dimension.runCommand(`fill ${blockLocation.x + x1} ${blockLocation.y + y1} ${blockLocation.z + z1} ${blockLocation.x + x2} ${blockLocation.y + y2} ${blockLocation.z + z2} ${blockToFill} ["minecraft:facing_direction"="${direction}"] replace water`);
}
