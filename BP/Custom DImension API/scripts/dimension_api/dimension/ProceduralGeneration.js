import { system, world } from "@minecraft/server";
import {
  CustomDimensionManager,
  GenerationType,
  VerticalChunkSize,
} from "./CustomDimension.js";
import { ChunkGenerator } from "./ChunkGenerator.js";

const dimManager = new CustomDimensionManager();
const chunkGenerators = new Map();

// Tracking de chunks gerados por dimensão
const generatedChunks = new Map(); // dimensionId -> Set("cx,cz")
// Tracking da última posição do jogador (em coordenadas de chunk)
const lastPlayerChunk = new Map(); // playerId -> "cx,cz"
// Chunks sendo processados atualmente (evita duplicatas)
const processingChunks = new Map(); // dimensionId -> Set("cx,cz")
// Fila de chunks para gerar
const chunkQueue = [];

const CHUNK_SIZE = 16;
const GENERATION_RADIUS = 4; // Raio de chunks ao redor do jogador
const CHUNKS_PER_TICK = 2; // Limite de chunks por tick
const SCAN_INTERVAL = 10; // Ticks entre scans

function getChunkKey(x, z) {
  const cx = Math.floor(x / CHUNK_SIZE);
  const cz = Math.floor(z / CHUNK_SIZE);
  return `${cx},${cz}`;
}

function getChunkCoords(x, z) {
  return {
    cx: Math.floor(x / CHUNK_SIZE),
    cz: Math.floor(z / CHUNK_SIZE)
  };
}

function getChunkOrigin(cx, cz) {
  return {
    x: cx * CHUNK_SIZE,
    y: 0,
    z: cz * CHUNK_SIZE
  };
}

// Verifica se chunk precisa ser gerado (mais robusto)
function needsGeneration(dimension, dimClass, cx, cz) {
  const origin = getChunkOrigin(cx, cz);
  let baseY = 0;

  if (dimClass.VerticalChunkSize === VerticalChunkSize.LOW) {
    baseY = 32;
  } else if (dimClass.VerticalChunkSize === VerticalChunkSize.HIGH) {
    baseY = -64;
  }

  // Verifica múltiplos pontos no chunk
  let airCount = 0;
  const checkPoints = [
    [0, 0], [4, 4], [8, 8], [12, 4], [4, 12], [12, 12]
  ];

  for (const [dx, dz] of checkPoints) {
    const block = dimension.getBlock({ 
      x: origin.x + dx, 
      y: baseY, 
      z: origin.z + dz 
    });
    if (!block || block.typeId === "minecraft:air") {
      airCount++;
    }
  }

  // Se mais de 2 pontos estão vazios, precisa gerar
  return airCount > 2;
}

// Escaneia chunks ao redor do jogador
function scanChunksAroundPlayer(player, dimension, dimClass) {
  const { cx: playerCX, cz: playerCZ } = getChunkCoords(
    player.location.x, 
    player.location.z
  );
  
  const dimensionId = dimension.id;
  const generated = generatedChunks.get(dimensionId);
  const processing = processingChunks.get(dimensionId);
  
  if (!generated || !processing) return [];
  
  const chunksToQueue = [];
  
  // Escaneia em espiral ao redor do jogador
  for (let ring = 0; ring <= GENERATION_RADIUS; ring++) {
    for (let dx = -ring; dx <= ring; dx++) {
      for (let dz = -ring; dz <= ring; dz++) {
        // Só pega borda do anel
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
        
        const cx = playerCX + dx;
        const cz = playerCZ + dz;
        const chunkKey = `${cx},${cz}`;
        
        // Pula se já gerado ou em processamento
        if (generated.has(chunkKey) || processing.has(chunkKey)) continue;
        
        // Verifica se precisa gerar
        if (needsGeneration(dimension, dimClass, cx, cz)) {
          chunksToQueue.push({
            cx,
            cz,
            origin: getChunkOrigin(cx, cz),
            distance: ring
          });
        } else {
          // Marca como gerado mesmo que já exista
          generated.add(chunkKey);
        }
      }
    }
  }
  
  // Ordena por distância (mais próximos primeiro)
  chunksToQueue.sort((a, b) => a.distance - b.distance);
  
  return chunksToQueue;
}

// Processa a fila de chunks
function processQueue() {
  if (chunkQueue.length === 0) return;
  
  let processed = 0;
  
  while (processed < CHUNKS_PER_TICK && chunkQueue.length > 0) {
    const task = chunkQueue.shift();
    const { dimensionId, cx, cz, origin } = task;
    
    const dimension = world.getDimension(dimensionId);
    if (!dimension) continue;
    
    const generator = chunkGenerators.get(dimensionId);
    if (!generator) continue;
    
    const processing = processingChunks.get(dimensionId);
    const generated = generatedChunks.get(dimensionId);
    
    // Verifica novamente se ainda precisa
    const chunkKey = `${cx},${cz}`;
    if (generated && generated.has(chunkKey)) continue;
    
    // Marca como processando
    processing?.add(chunkKey);
    
    try {
      // Gera o chunk
      generator.generateChunk(origin);
      
      // Marca como gerado
      generated?.add(chunkKey);
      
      // Callback opcional
      if (typeof generator.dimClass?.onChunkGeneration === "function") {
        generator.dimClass.onChunkGeneration(dimension, origin);
      }
    } catch (error) {
      console.error(`Error generating chunk ${chunkKey}:`, error);
    } finally {
      processing?.delete(chunkKey);
    }
    
    processed++;
  }
}

// Loop principal de escaneamento (executa a cada SCAN_INTERVAL ticks)
system.runInterval(() => {
  const players = world.getPlayers();
  
  for (const player of players) {
    const dimension = player.dimension;
    const dimClass = dimManager.getDimension(dimension.id);
    
    if (!dimClass || dimClass.generationType !== GenerationType.DYNAMIC || !dimClass.readyToGenerate) continue;
    
    const dimensionId = dimension.id;
    const playerChunk = getChunkKey(player.location.x, player.location.z);
    
    // Verifica se jogador mudou de chunk
    const lastChunk = lastPlayerChunk.get(player.id);
    if (lastChunk === playerChunk) continue; // Não mudou de chunk, pula
    
    // Atualiza última posição
    lastPlayerChunk.set(player.id, playerChunk);
    
    // Inicializa estruturas para esta dimensão
    if (!generatedChunks.has(dimensionId)) {
      generatedChunks.set(dimensionId, new Set());
    }
    if (!processingChunks.has(dimensionId)) {
      processingChunks.set(dimensionId, new Set());
    }
    if (!chunkGenerators.has(dimensionId)) {
      const generator = new ChunkGenerator(dimension, dimClass);
      chunkGenerators.set(dimensionId, generator);
    }
    
    // Escaneia chunks ao redor
    const newChunks = scanChunksAroundPlayer(player, dimension, dimClass);
    
    // Adiciona à fila com informação da dimensão
    for (const chunk of newChunks) {
      chunk.dimensionId = dimensionId;
      chunkQueue.push(chunk);
    }
    
    // Debug (remova em produção)
    if (newChunks.length > 0) {
      console.log(`Queued ${newChunks.length} chunks for player ${player.name}`);
    }
  }
}, SCAN_INTERVAL);

// Processa fila a cada tick (mas limitado por CHUNKS_PER_TICK)
system.runInterval(() => {
  processQueue();
}, 1);

// Limpeza quando jogador sai
world.afterEvents.playerLeave.subscribe((event) => {
  const playerId = event.playerId;
  lastPlayerChunk.delete(playerId);
  
  // Se não há mais jogadores na dimensão, limpa recursos
  const activeDimensions = new Set();
  for (const player of world.getPlayers()) {
    activeDimensions.add(player.dimension.id);
  }
  
  for (const [dimId, generator] of chunkGenerators) {
    if (!activeDimensions.has(dimId)) {
      chunkGenerators.delete(dimId);
      generatedChunks.delete(dimId);
      processingChunks.delete(dimId);
    }
  }
  
  // Limpa fila de chunks para dimensões sem jogadores
  for (let i = chunkQueue.length - 1; i >= 0; i--) {
    if (!activeDimensions.has(chunkQueue[i].dimensionId)) {
      chunkQueue.splice(i, 1);
    }
  }
});