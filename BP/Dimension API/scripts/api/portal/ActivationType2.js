import { world, system } from '@minecraft/server';
import { detectBlocks, fillPortalBlocks } from './Utils.js'

world.afterEvents.entitySpawn.subscribe((event) => {
    const entity = event.entity;

    if (entity.typeId == 'minecraft:item') {
        const itemComponent = entity.getComponent('minecraft:item').itemStack;

        if (itemComponent.typeId == 'minecraft:emerald') {
            const entityLoc = entity.location;
            const dimension = world.getDimension('overworld');

            if (detectBlocks('minecraft:water', -1, 1, 0, 0, -1, 1, entityLoc, dimension) == 9) {
                fillPortalBlocks(dimension, entityLoc, '013:portal_block_2', -1, 0, -1, 1, 0, 1);
                dimension.spawnEntity('minecraft:lightning_bolt', entityLoc);
            }
        }
    }
});