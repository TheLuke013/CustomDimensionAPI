import { world } from '@minecraft/server';
import { detectBlocks, fillPortalBlocks } from './Utils.js';
import { CustomPortalManager, PortalType } from './CustomPortal.js';

world.afterEvents.entitySpawn.subscribe((event) => {
    const entity = event.entity;
    const portalManager = new CustomPortalManager();

    if (entity.typeId == 'minecraft:item') {
        const itemComponent = entity.getComponent('minecraft:item').itemStack;

        portalManager.portals.forEach(portal => {
            if (portal.type == PortalType.THE_END) {
                if (itemComponent.typeId == portal.lightWithItem) {
                    const entityLoc = entity.location;
                    const dimension = world.getDimension('overworld');
        
                    if (detectBlocks(portal.frameBlock, -1, 1, 0, 0, -1, 1, entityLoc, dimension) == 9) {
                        fillPortalBlocks(dimension, entityLoc, portal.portalBlock, -1, 0, -1, 1, 0, 1);
                        if (portal.hasLightning) {
                            dimension.spawnEntity('minecraft:lightning_bolt', entityLoc);
                        }
                    }
                }
            }
        });
    }
});