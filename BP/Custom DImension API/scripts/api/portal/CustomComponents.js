import { system, world } from '@minecraft/server';
import { CustomPortalManager } from './CustomPortal.js';

const portalManager = new CustomPortalManager();

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('custom_dim:portal_block', {
        onRandomTick: e => {
            e.dimension.playSound('portal.portal', e.block.location);
        },
        onTick: e => {
            const dim = e.dimension;
            const loc = e.block.location;
            const mobs = dim.getEntities({
                location: loc,
                maxDistance: 1.0,
                excludeTags: ['teleporting_dim']
            });

            mobs.forEach((mob) => {
                world.sendMessage('mob dentro do portal');
                const msg = {
                    mobId: mob.id,
                    portal: portalManager.getPortalByBlock(e.block.typeId)
                };
                system.sendScriptEvent('custom_dim:dim_teleporter', JSON.stringify(msg));
            });
        }
    });

    initEvent.blockComponentRegistry.registerCustomComponent('custom_dim:portal_frame', {
        onPlayerInteract: e => {
            const itemInHand = e.player.getComponent('minecraft:inventory').container.getItem(e.player.selectedSlotIndex);

            if (itemInHand) {
                const itemName = itemInHand.typeId;

                portalManager.portals.forEach(portal => {
                    if (itemName === portal.lightWithItem) {
                        e.block.setType(`${e.block.typeId}_activated`);
                        e.dimension.playSound(portal.soundAttachItem, e.block.location);
                    }
                });
            }
        }
    });
});