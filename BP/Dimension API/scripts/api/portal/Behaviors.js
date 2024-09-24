import { system, world } from '@minecraft/server';
import { detectBlocks } from './Utils.js';

//detect player entering in the dimension
system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');

    player.forEach(player => {
        const location = player.location;

        //dimension 1
        if (detectBlocks('013:portal_block_1', 0, 0, 0, 0, 0, 0, location, dimension) &&
            player.getTags() != 'portal' && player.getTags() != 'back_to_home') {
            player.addTag('portal');
    
            dimension.spawnEntity('013:teleporter', location);
            dimension.spawnEntity('013:generator', location);
        } else if (detectBlocks('013:portal_block_1', 0, 0, 0, 0, 0, 0, location, dimension) &&
            player.getTags() != 'portal' && player.getTags() == 'back_to_home') {
            world.sendMessage('Backing to home...');
        }

        //dimension 2
        if (detectBlocks('013:portal_block_2', 0, 0, 0, 0, 0, 0, location, dimension) &&
            player.getTags() != 'portal2' && player.getTags() != 'back_to_home_2') {
            player.teleport({ x: 100, y: 100, z: 100 });
            player.addTag('portal2');
            dimension.runCommand('function dimension_2');
        } else if (detectBlocks('013:portal_block_2', 0, 0, 0, 0, 0, 0, location, dimension) &&
            player.getTags() != 'portal2' && player.getTags() == 'back_to_home_2') {
            world.sendMessage('Backing to home...');
        }
    });


}, 20);
