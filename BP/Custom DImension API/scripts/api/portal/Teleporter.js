import { system, world } from '@minecraft/server';
import { detectBlocks } from '../utils/Utils.js';
import { CustomPortalManager, PortalType } from './CustomPortal.js';
import { CustomDimensionManager } from '../dimension/CustomDimension.js';
import { SimpleVector3 } from '../utils/SimpleVector3.js';
import { PlayersData } from '../data/PlayerData.js';

let currentTime = 0;
const targetTime = 5;
const playersData = new PlayersData();

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

                //register the current player pos
                playersData.registerPlayerData(player);

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
                    else {
                        player.addTag('back_to_home');
                    }
                }
            } else if (detectBlocks(portal.portalBlock, 0, 0, 0, 0, 0, 0, location, dimension) &&
                player.getTags().includes('back_to_home')) {
                teleportToHome(player);
            }
        })
    });
}, 20);

function teleportToDimension(player, dimensionLoc) {
    player.camera.fade({ fadeTime: { fadeInTime: 0, fadeOutTime: 2, holdTime: 10 } });
    player.addEffect('minecraft:slow_falling', 180, {
        amplifier: 255,
        showParticles: false
    });
    player.teleport({ x: dimensionLoc.x, y: dimensionLoc.y + 5, z: dimensionLoc.z });
}

function teleportToHome(player) {
    player.camera.fade({ fadeTime: { fadeInTime: 0, fadeOutTime: 2, holdTime: 4 } });
    const homePos = playersData.getPlayerData(player.name).location;
    player.teleport({ x: homePos.x + 5, y: homePos.y, z: homePos.z + 5 });
    player.removeTag("back_to_home");
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
