import { placeBlocks } from "../utils/Utils.js";

export function GenerateNetherPortal(portalBlock, frameBlock, location, dimension) {
    placeBlocks(frameBlock, 0, 3, 0, 0, 0, 0, location, dimension); //DOWN
    placeBlocks(frameBlock, 0, 3, 4, 4, 0, 0, location, dimension); //UP
    placeBlocks(frameBlock, 0, 0, 1, 3, 0, 0, location, dimension); //SIDE 1
    placeBlocks(frameBlock, 3, 3, 1, 3, 0, 0, location, dimension); //SIDE 2
    placeBlocks(portalBlock, 1, 2, 1, 3, 0, 0, location, dimension); //PORTAL BLOCK
}

export function GenerateTheEndPortal(portalBlock, frameBlock, location, dimension) {
    placeBlocks(frameBlock, 0, 0, 0, 0, 1, 3, location, dimension); //SIDE 1
    placeBlocks(frameBlock, 4, 4, 0, 0, 1, 3, location, dimension); //SIDE 2
    placeBlocks(frameBlock, 1, 3, 0, 0, 0, 0, location, dimension); //SIDE 3
    placeBlocks(frameBlock, 1, 3, 0, 0, 4, 4, location, dimension); //SIDE 4
    placeBlocks(portalBlock, 1, 3, 0, 0, 1, 3, location, dimension); //PORTAL BLOCK
}