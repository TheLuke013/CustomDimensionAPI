import { system, world } from '@minecraft/server';
import { detectBlocks } from '../utils/Utils.js';
import { CustomPortalManager, PortalType } from './CustomPortal.js';
import { CustomDimensionManager } from '../dimension/CustomDimension.js';
import { SimpleVector3 } from '../utils/SimpleVector3.js';

let currentTime = 0;
const targetTime = 5;

//detect player entering in the dimension
system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');
    const portalManager = new CustomPortalManager();
    const dimManager = new CustomDimensionManager();

    portalManager.portals.forEach(portal => {
        player.forEach(player => {
            const location = player.location;

            if (detectBlocks(portal.portalBlock, 0, 0, 0, 0, 0, 0, location, dimension) &&
                !player.getTags().includes('back_to_home')) {
                let dimensionLoc = new SimpleVector3();
                
                //search dimension by namespace
                dimManager.dimensions.forEach(dimension => {
                    if (dimension.namespace == portal.destDimID) {
                        dimensionLoc.x = dimension.location.x;
                        dimensionLoc.y = dimension.location.y;
                        dimensionLoc.z = dimension.location.z;
                    }
                });

                if (portal.type == PortalType.NETHER) {
                    teleportTimer(player, dimensionLoc, portal.destDimID);
                } else if (portal.type == PortalType.THE_END) {
                    teleportToDimension(player, dimensionLoc, portal.destDimID);
                }

                if (portal.type == PortalType.NETHER && currentTime == targetTime - 1 || portal.type == PortalType.THE_END) {
                    if (!player.getTags().includes(`${portal.destDimID}_generated`))
                    {
                        player.addTag(`generate_dimension_${portal.destDimID}`);
                    }
                }
            } else if (detectBlocks(portal.portalBlock, 0, 0, 0, 0, 0, 0, location, dimension) &&
                player.getTags().includes('back_to_home')) {
                world.sendMessage('Backing to home...');
            }
        })
    });
}, 20);

function teleportToDimension(player, dimensionLoc) {
    player.addEffect('minecraft:slow_falling', 180, {
        amplifier: 255,
        showParticles: false
    });
    player.teleport({ x: dimensionLoc.x, y: dimensionLoc.y + 5, z: dimensionLoc.z });
}

function teleportTimer(player, dimensionLoc) {
    currentTime++;

    if (currentTime >= targetTime) {
        teleportToDimension(player, dimensionLoc);
        currentTime = 0;
    } else if (currentTime == 1) {
        player.addEffect('minecraft:nausea', 180, {
            amplifier: 255,
            showParticles: false
        });
        player.playSound('portal.trigger');
    }
}
