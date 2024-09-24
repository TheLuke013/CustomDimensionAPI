import { system, world } from '@minecraft/server';
import { ChunkGenerator } from './ChunkGenerator.js';

let generatedChunks = 0;

const chunkPos = [
    [-10000, -10000, 199],
    [-10017, -10017, 199],
    [-10017, -9983, 199],
    [-9983, -10017, 199],
    [-10000, -10017, 199],
    [-10017, -10000, 199],
    [-9983, -9983, 199],
    [-10000, -9983, 199],
    [-9983, -10000, 199]
];

const maxChunks = 9;

system.runInterval(() => {
    const player = world.getPlayers();
    const dimension = world.getDimension('overworld');

    player.forEach(player => {
        const location = player.location;

        //dimension generation
        if (player.getTags() == 'generate_dimension_1') {
            player.playSound('portal.travel');
            player.removeTag('generate_dimension_1');
            player.addTag('wait_gen');
        }

        if (player.getTags() == 'generate' && generatedChunks < maxChunks) {
            generate(dimension);

            player.removeTag('generate');
            player.addTag('wait_gen');
        }

        if (generatedChunks >= maxChunks) {
            dimension.runCommand('event entity @e[type=013:generator] 013:despawn');
            player.removeTag('generate_dimension_1');
        }
    });
});

function generate(dimension) {
    const materials = [
        'minecraft:grass_block',
        'minecraft:dirt',
        'minecraft:stone',
        'minecraft:bedrock'
    ];
    const generator = new ChunkGenerator(16, 64, 12345, 0.02);
    generator.generate(
        chunkPos[generatedChunks][0],
        chunkPos[generatedChunks][2],
        chunkPos[generatedChunks][1],
        dimension, materials[0], materials[1], materials[2], materials[3]);

    generatedChunks++;
}