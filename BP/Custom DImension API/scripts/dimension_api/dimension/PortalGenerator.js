import { placeBlocks, detectSurfaceFloor } from "../utils/Utils.js";
import { CustomPortalManager, PortalType } from "../portal/CustomPortal.js";
import { CustomDimensionManager } from "../dimension/CustomDimension.js"

const dimManager = new CustomDimensionManager();
const portalManager = new CustomPortalManager();

export function generatePortal(dimNamespace, location, dimension) {
  portalManager.portals.forEach((portal) => {
    if (portal.destDimID == dimNamespace) {
      if (portal.type == PortalType.NETHER) {
        const baseBlock = dimManager.getDimension(dimNamespace).terrainMaterials.topMaterial;
        const pLocY = detectSurfaceFloor(dimension, location, baseBlock, -10, 100);
        const portalLoc = { x: location.x, y: pLocY, z: location.z };

        GenerateNetherPortal(
          portal.portalBlock,
          portal.frameBlock,
          portalLoc,
          dimension,
        );
      } else if (portal.type == PortalType.THE_END) {
        const platformBlock = dimManager.getDimension(dimNamespace).terrainMaterials.bottomMaterial;
        GenerateTheEndPortal(
          portal.portalBlock,
          portal.frameBlock,
          platformBlock,
          location,
          dimension,
        );
      }
    }
  });
}

function GenerateNetherPortal(portalBlock, frameBlock, location, dimension) {
  placeBlocks(frameBlock, 0, 3, 0, 0, 0, 0, location, dimension); //DOWN
  placeBlocks(frameBlock, 0, 3, 4, 4, 0, 0, location, dimension); //UP
  placeBlocks(frameBlock, 0, 0, 1, 3, 0, 0, location, dimension); //SIDE 1
  placeBlocks(frameBlock, 3, 3, 1, 3, 0, 0, location, dimension); //SIDE 2
  placeBlocks(portalBlock, 1, 2, 1, 3, 0, 0, location, dimension); //PORTAL BLOCK
}

function GenerateTheEndPortal(portalBlock, frameBlock, platformBlock, location, dimension) {
  placeBlocks(frameBlock, 0, 0, 0, 0, 1, 3, location, dimension); //SIDE 1
  placeBlocks(frameBlock, 4, 4, 0, 0, 1, 3, location, dimension); //SIDE 2
  placeBlocks(frameBlock, 1, 3, 0, 0, 0, 0, location, dimension); //SIDE 3
  placeBlocks(frameBlock, 1, 3, 0, 0, 4, 4, location, dimension); //SIDE 4
  placeBlocks(portalBlock, 1, 3, 0, 0, 1, 3, location, dimension); //PORTAL BLOCK
  placeBlocks(platformBlock, -1, 5, -1, -1, -1, 5, location, dimension); //PLATFORM BLOCK
}
