import { placeBlocks } from "../utils/Utils.js";
import { CustomPortalManager, PortalType } from "../portal/CustomPortal.js";

export function generatePortal(dimNamespace, location, dimension) {
  const portalManager = new CustomPortalManager();
  const pLocY = detectSurfaceFloor(dimension, location);
  const portalLoc = { x: location.x, y: pLocY, z: location.z };

  portalManager.portals.forEach((portal) => {
    if (portal.destDimID == dimNamespace) {
      if (portal.type == PortalType.NETHER) {
        GenerateNetherPortal(
          portal.portalBlock,
          portal.frameBlock,
          portalLoc,
          dimension,
        );
      } else if (portal.type == PortalType.THE_END) {
        GenerateTheEndPortal(
          portal.portalBlock,
          portal.frameBlock,
          portalLoc,
          dimension,
        );
      }
    }
  });
}

function detectSurfaceFloor(
  dim,
  entryLoc,
  startOffsetY = -10,
  maxOffsetY = 10,
) {
  for (let y = startOffsetY; y <= maxOffsetY; y++) {
    const groundLoc = {
      x: entryLoc.x,
      y: entryLoc.y + y,
      z: entryLoc.z,
    };

    const aboveLoc = {
      x: entryLoc.x,
      y: entryLoc.y + y + 1,
      z: entryLoc.z,
    };

    const groundBlock = dim.getBlock(groundLoc);
    const aboveBlock = dim.getBlock(aboveLoc);

    if (
      groundBlock &&
      groundBlock.typeId !== "minecraft:air" &&
      aboveBlock &&
      aboveBlock.typeId === "minecraft:air"
    ) {
      return aboveBlock.location.y;
    }
  }

  return entryLoc.y;
}

function GenerateNetherPortal(portalBlock, frameBlock, location, dimension) {
  placeBlocks(frameBlock, 0, 3, 0, 0, 0, 0, location, dimension); //DOWN
  placeBlocks(frameBlock, 0, 3, 4, 4, 0, 0, location, dimension); //UP
  placeBlocks(frameBlock, 0, 0, 1, 3, 0, 0, location, dimension); //SIDE 1
  placeBlocks(frameBlock, 3, 3, 1, 3, 0, 0, location, dimension); //SIDE 2
  placeBlocks(portalBlock, 1, 2, 1, 3, 0, 0, location, dimension); //PORTAL BLOCK
}

function GenerateTheEndPortal(portalBlock, frameBlock, location, dimension) {
  placeBlocks(frameBlock, 0, 0, 0, 0, 1, 3, location, dimension); //SIDE 1
  placeBlocks(frameBlock, 4, 4, 0, 0, 1, 3, location, dimension); //SIDE 2
  placeBlocks(frameBlock, 1, 3, 0, 0, 0, 0, location, dimension); //SIDE 3
  placeBlocks(frameBlock, 1, 3, 0, 0, 4, 4, location, dimension); //SIDE 4
  placeBlocks(portalBlock, 1, 3, 0, 0, 1, 3, location, dimension); //PORTAL BLOCK
}
