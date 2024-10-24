import { world } from '@minecraft/server';
import { CustomPortalManager } from './CustomPortal.js';

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('013:portal', {
        onRandomTick: e => {
            e.dimension.playSound('portal.portal', e.block.location);
        },

        onPlayerDestroy: e => {
            //const loc = e.block.location;
            //e.dimension.runCommand(`fill ${loc.x} ${loc.y - 2} ${loc.z} ${loc.x} ${loc.y + 2} ${loc.z} air replace ${e.block.typeId}`);
        }
    });

    initEvent.blockComponentRegistry.registerCustomComponent('013:portal_frame', {
        onPlayerInteract: e => {
            const itemInHand = e.player.getComponent('minecraft:inventory').container.getItem(e.player.selectedSlotIndex);

            if (itemInHand) {
                const itemName = itemInHand.typeId;
                const portalManager = new CustomPortalManager();

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