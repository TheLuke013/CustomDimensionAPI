import { world } from '@minecraft/server';

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
            world.sendMessage('colocar olho no portal costumizado do end');
        }
    });
});