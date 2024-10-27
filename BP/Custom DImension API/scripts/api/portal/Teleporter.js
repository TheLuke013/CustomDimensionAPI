import { system, world } from '@minecraft/server';
import { detectBlocks } from './Utils.js';
import { CustomPortalManager, PortalType } from './CustomPortal.js';
import { CustomDimensionManager } from '../dimension/CustomDimension.js';

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
            player.getTags() != `portal_${portal.destDimID}` && player.getTags() != 'back_to_home') {
                player.addTag(`portal_${portal.destDimID}`);
                let dimensionLoc = [0, 0, 0];

                dimManager.dimensions.forEach(dimension => {
                    if (dimension.namespace == portal.destDimID) {
                        dimensionLoc[0] = dimension.location[0];
                        dimensionLoc[1] = dimension.location[1];
                        dimensionLoc[2] = dimension.location[2];
                    } else {
                        world.sendMessage(`Dimension ${portal.destDimID} not found`);
                    }
                });

                if (portal.type == PortalType.NETHER) {
                    teleportTimer(player, dimensionLoc);
                } else if (portal.type == PortalType.THE_END) {
                    teleportToDimension(player, dimensionLoc);
                }
            } else if (detectBlocks(portal.portalBlock, 0, 0, 0, 0, 0, 0, location, dimension) &&
            player.getTags() != `portal_${portal.destDimID}` && player.getTags() == 'back_to_home') {
                world.sendMessage('Backing to home...');
            }
        })
    });
}, 20);

function teleportToDimension(player, dimensionLoc) {
    player.teleport({x: dimensionLoc[0], y: dimensionLoc[1], z: dimensionLoc[2]});
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
