# Documentação da API - Custom Dimension API

Documentação técnica completa de todas as classes e métodos disponíveis na Custom Dimension API.

## Índice

1. [Sistema de Dimensões](#sistema-de-dimensões)
2. [Sistema de Portais](#sistema-de-portais)
3. [Gerenciamento de Features](#gerenciamento-de-features)
4. [Eventos e Callbacks](#eventos-e-callbacks)
5. [Utilitários](#utilitários)
6. [Exemplos Avançados](#exemplos-avançados)

---

## Sistema de Dimensões

### CustomDimension

Classe principal para criar uma dimensão personalizada.

#### Construtor

```javascript
new CustomDimension(
  namespace,              // string: ID único (ex: "addon:dimension_name")
  terrainMaterials,       // TerrainMaterials: Materiais do terreno
  spawnLoc,               // object: Localização de spawn {x, y, z}
  verticalChunkSize,      // string: LOW, MEDIUM ou HIGH
  reliefType,             // string: Tipo de relevo (opcional, padrão: HILLS)
  worldType,              // string: OVERWORLD, NETHER, END, CUSTOM (opcional)
  generationType          // string: FIXED ou DYNAMIC (opcional)
)
```

#### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `namespace` | string | ID único da dimensão no formato "addon:name" |
| `terrainMaterials` | TerrainMaterials | Define os blocos usados no terreno |
| `spawnLoc` | object | Ponto de spawn com coordenadas {x, y, z} |
| `verticalChunkSize` | string | Altura dos chunks (LOW/MEDIUM/HIGH) |
| `reliefType` | string | Tipo de geração de terreno |
| `worldType` | string | Tipo de ambiente (Overworld/Nether/End/Custom) |
| `generationType` | string | FIXED (limitado) ou DYNAMIC (infinito) |

#### Propriedades

```javascript
// Configuração básica
dimension.namespace              // ID da dimensão
dimension.terrainMaterials       // Materiais do terreno
dimension.spawnLoc               // Localização de spawn {x, y, z}
dimension.maxChunks              // Máximo de chunks (apenas FIXED)
dimension.VerticalChunkSize      // Tamanho vertical
dimension.generationType         // Tipo de geração
dimension.reliefType             // Tipo de relevo
dimension.worldType              // Tipo de mundo

// Configuração de geração
dimension.canGenerateTerrain      // boolean: Gerar terreno?
dimension.canGenerateCommonFeatures // boolean: Gerar estruturas?
dimension.canGenerateVanillaOres  // boolean: Gerar minérios?
dimension.canGeneratePortal       // boolean: Gerar portal?
dimension.canGenerateLakes        // boolean: Gerar lagos?
dimension.canSpawnVanillaMobs     // boolean: Spawnar mobs?

// Personalização
dimension.dimensionFog            // string: Efeito de neblina customizado

// Callbacks
dimension.onFirstGeneration       // Callback: Primeira geração
dimension.onEnters                // Callback: Jogador entra
dimension.onLeaves                // Callback: Jogador sai
dimension.onChunkGeneration       // Callback: Chunk gerado
```

#### Exemplo Completo

```javascript
import { CustomDimension, CustomDimensionManager, TerrainMaterials, 
         VerticalChunkSize, ReliefType } from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

// Criar dimensão com terreno customizado
const skyDimension = new CustomDimension(
  "my_addon:sky_world",
  new TerrainMaterials("glass", "light_blue_concrete", "blue_concrete", "bedrock"),
  { x: 0, y: 128, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.MOUNTAINS,
  WorldType.CUSTOM,
  GenerationType.DYNAMIC
);

// Configurar opções
skyDimension.canSpawnVanillaMobs = false;
skyDimension.canGenerateVanillaOres = false;
skyDimension.dimensionFog = 'custom_fog_effect';

// Adicionar callbacks
skyDimension.onEnters = (player) => {
  console.log(`${player.name} entrou no Sky World!`);
};

skyDimension.onChunkGeneration = (chunk) => {
  console.log(`Chunk gerado em ${chunk.x}, ${chunk.z}`);
};

manager.registerDimension(skyDimension);
```

---

### TerrainMaterials

Define os materiais usados em cada camada do terreno.

#### Construtor

```javascript
new TerrainMaterials(
  topMat,     // string: Bloco do topo (padrão: "grass_block")
  midMat,     // string: Bloco do meio (padrão: "dirt")
  bottomMat,  // string: Bloco da base (padrão: "stone")
  baseMat     // string: Bloco de fundação (padrão: "bedrock")
)
```

#### Exemplo

```javascript
// Dimensão de End customizada
const endMaterials = new TerrainMaterials(
  "end_stone",
  "end_stone",
  "purpur_block",
  "bedrock"
);

// Dimensão de Nether customizada
const netherMaterials = new TerrainMaterials(
  "netherrack",
  "netherrack",
  "netherrack",
  "bedrock"
);

// Mundo personalizador
const customMaterials = new TerrainMaterials(
  "mymodded_grass",
  "mymodded_dirt",
  "mymodded_stone",
  "bedrock"
);
```

---

### CustomDimensionManager

Gerenciador singleton para registrar e gerenciar dimensões.

#### Métodos

```javascript
// Obter instância (singleton)
const manager = new CustomDimensionManager();

// Registrar dimensão
manager.registerDimension(customDimension);

// Acessar dimensões registradas
manager.dimensions  // Array de CustomDimension
```

#### Exemplo

```javascript
const manager = new CustomDimensionManager();

const dim1 = new CustomDimension(...);
const dim2 = new CustomDimension(...);

manager.registerDimension(dim1);
manager.registerDimension(dim2);

// Iterar sobre todas as dimensões
manager.dimensions.forEach(dim => {
  console.log(`Dimensão: ${dim.namespace}`);
});
```

---

### Constantes

#### VerticalChunkSize

```javascript
VerticalChunkSize.LOW     // 32 blocos de altura
VerticalChunkSize.MEDIUM  // 64 blocos de altura
VerticalChunkSize.HIGH    // 128 blocos de altura
```

#### GenerationType

```javascript
GenerationType.FIXED      // Tamanho limitado (maxChunks)
GenerationType.DYNAMIC    // Tamanho infinito
```

#### ReliefType

```javascript
ReliefType.FLAT                 // Totalmente plano
ReliefType.HILLS                // Colinas suaves
ReliefType.MOUNTAINS            // Montanhas altas
ReliefType.PLAINS               // Planícies onduladas
ReliefType.ISLAND_CHAIN         // Cadeia de ilhas
ReliefType.OCEAN                // Oceano profundo
ReliefType.HILLS_WITH_RIVERS    // Colinas com rios
```

#### WorldType

```javascript
WorldType.OVERWORLD  // Tipo Overworld
WorldType.NETHER     // Tipo Nether
WorldType.END        // Tipo End
WorldType.CUSTOM     // Tipo customizado
```

---

## Sistema de Portais

### CustomPortal

Cria um portal funcional para transportar jogadores entre dimensões.

#### Construtor

```javascript
new CustomPortal(
  namespace,            // string: ID único do portal
  portalType,           // string: Tipo do portal (NETHER, THE_END, etc)
  frameBlock,           // string: Bloco da moldura
  portalBlock,          // string: Bloco que preenche o portal
  activationItem,       // string: Item para ativar o portal
  destinationDimension, // string: ID da dimensão destino
  requiresCompleteFrame // boolean: Precisa de frame completo?
)
```

#### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `namespace` | string | ID único (ex: "addon:portal_name") |
| `portalType` | string | NETHER, THE_END ou customizado |
| `frameBlock` | string | Bloco que forma a moldura |
| `portalBlock` | string | Bloco visual do portal |
| `activationItem` | string | Item necessário para ativar |
| `destinationDimension` | string | ID da dimensão destino |
| `requiresCompleteFrame` | boolean | Se true, precisa de frame completo |

#### Propriedades

```javascript
portal.namespace
portal.portalType
portal.frameBlock
portal.portalBlock
portal.activationItem
portal.destinationDimension
portal.requiresCompleteFrame
```

#### Exemplo

```javascript
import { CustomPortal, CustomPortalManager, PortalType } from 
  './dimension_api/portal/CustomPortal.js';

const portalManager = new CustomPortalManager();

// Portal tipo Nether
const netherPortal = new CustomPortal(
  "my_addon:nether_portal",
  PortalType.NETHER,
  "obsidian",
  "portal",
  "flint_and_steel",
  "my_addon:custom_nether",
  true  // Requer frame completo
);

// Portal tipo End
const endPortal = new CustomPortal(
  "my_addon:end_portal",
  PortalType.THE_END,
  "end_portal_frame",
  "end_portal",
  "eye_of_ender",
  "my_addon:custom_end",
  false  // Não requer frame
);

portalManager.registerPortal(netherPortal);
portalManager.registerPortal(endPortal);
```

---

### CustomPortalManager

Gerenciador singleton para portais.

#### Métodos

```javascript
// Obter instância
const manager = new CustomPortalManager();

// Registrar portal
manager.registerPortal(customPortal);

// Acessar portais
manager.portals  // Array de CustomPortal
```

---

### PortalType

```javascript
PortalType.NETHER    // Portal tipo Nether
PortalType.THE_END   // Portal tipo End
// Outros tipos customizados podem ser adicionados
```

---

## Gerenciamento de Features

### FeaturesManager

Gerencia features (estruturas, minérios, etc) na dimensão.

#### Métodos

```javascript
const featuresManager = new FeaturesManager();

// Registrar feature
featuresManager.registerFeature('addon:feature_name');

// Remover feature
featuresManager.unregisterFeature('addon:feature_name');
```

#### Exemplo

```javascript
import { FeaturesManager } from './dimension_api/dimension/FeaturesManager.js';

const featuresManager = new FeaturesManager();

// Registrar minérios customizados
featuresManager.registerFeature('my_addon:custom_ore_feature');
featuresManager.registerFeature('my_addon:rare_gem_feature');

// Registrar estruturas
featuresManager.registerFeature('my_addon:tower_structure');
featuresManager.registerFeature('my_addon:cave_system');
```

---

## Eventos e Callbacks

### Callbacks de Dimensão

Você pode anexar callbacks a eventos da dimensão:

```javascript
// Evento: Primeira geração
dimension.onFirstGeneration = (world) => {
  console.log("Dimensão criada pela primeira vez!");
};

// Evento: Jogador entra
dimension.onEnters = (player) => {
  player.sendMessage(`Bem-vindo a ${dimension.namespace}!`);
};

// Evento: Jogador sai
dimension.onLeaves = (player) => {
  console.log(`${player.name} saiu da dimensão`);
};

// Evento: Chunk gerado
dimension.onChunkGeneration = (chunk) => {
  console.log(`Chunk gerado: ${chunk.x}, ${chunk.z}`);
};
```

---

## Utilitários

### ChunkGenerator

Classe para gerar chunks com terreno procedural.

```javascript
import { ChunkGenerator } from './dimension_api/dimension/ChunkGenerator.js';

const generator = new ChunkGenerator(
  terrainMaterials,
  reliefType,
  verticalChunkSize
);

const chunk = generator.generateChunk(chunkX, chunkZ);
```

---

### FastNoiseLite

Implementação de ruído de Perlin para geração de terreno procedural.

```javascript
import { FastNoiseLite } from './dimension_api/dimension/FastNoiseLite.js';

const noise = new FastNoiseLite();
const value = noise.GetNoise(x, z);
```

---

## Exemplos Avançados

### Exemplo 1: Dimensão Dual com Dois Tipos de Terreno

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType,
  WorldType
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

// Mundo superior (céu)
const skyWorld = new CustomDimension(
  "dual:sky_world",
  new TerrainMaterials("glass", "light_blue_concrete", "blue_concrete", "bedrock"),
  { x: 0, y: 200, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.MOUNTAINS,
  WorldType.CUSTOM,
  GenerationType.FIXED
);

skyWorld.maxChunks = 256;
skyWorld.canSpawnVanillaMobs = false;

// Mundo subterrâneo
const underworld = new CustomDimension(
  "dual:underworld",
  new TerrainMaterials("deepslate", "deepslate", "blackstone", "bedrock"),
  { x: 0, y: 32, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.OCEAN,
  WorldType.CUSTOM,
  GenerationType.DYNAMIC
);

underworld.canGenerateVanillaOres = false;

manager.registerDimension(skyWorld);
manager.registerDimension(underworld);
```

### Exemplo 2: Sistema de Portais Completo

```javascript
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

const portalManager = new CustomPortalManager();

// Rede de portais
const portals = [
  {
    id: "portal:forest",
    frame: "oak_log",
    portal: "emerald_block",
    activation: "emerald",
    destination: "worlds:forest_dimension"
  },
  {
    id: "portal:desert",
    frame: "sandstone",
    portal: "sand",
    activation: "golden_apple",
    destination: "worlds:desert_dimension"
  },
  {
    id: "portal:ice",
    frame: "packed_ice",
    portal: "blue_ice",
    activation: "snowball",
    destination: "worlds:ice_dimension"
  }
];

portals.forEach(p => {
  const portal = new CustomPortal(
    p.id,
    PortalType.NETHER,
    p.frame,
    p.portal,
    p.activation,
    p.destination,
    false
  );
  portalManager.registerPortal(portal);
});
```

### Exemplo 3: Dimensão com Callbacks Completos

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType
} from './dimension_api/dimension/CustomDimension.js';
import { world } from "@minecraft/server";

const manager = new CustomDimensionManager();

const eventfulDim = new CustomDimension(
  "events:dimension",
  new TerrainMaterials("moss_block", "dirt", "stone", "bedrock"),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS_WITH_RIVERS
);

// Evento: Primeira geração
eventfulDim.onFirstGeneration = (dimension) => {
  console.log("🌍 Nova dimensão criada!");
  // Executar setup inicial
};

// Evento: Jogador entra
eventfulDim.onEnters = (player) => {
  player.sendMessage("§a✓ Bem-vindo à dimensão dos eventos!");
  // Dar efeitos, itens, etc
};

// Evento: Jogador sai
eventfulDim.onLeaves = (player) => {
  console.log(`${player.name} saiu`);
};

// Evento: Chunk gerado
eventfulDim.onChunkGeneration = (chunk) => {
  // Lógica customizada após geração
  console.log(`Chunk ${chunk.x},${chunk.z} gerado`);
};

manager.registerDimension(eventfulDim);
```

---

## Dicas e Boas Práticas

1. **Use Singleton**: O `CustomDimensionManager` é um singleton. Sempre use a mesma instância.

```javascript
const manager1 = new CustomDimensionManager();
const manager2 = new CustomDimensionManager();
// manager1 === manager2 (mesma instância)
```

2. **Configure Features em Arquivos JSON**: Defina features nos arquivos de feature rules do seu addon.

3. **Teste Diferentes Tipos de Relevo**: Cada `ReliefType` cria ambientes únicos. Experimente!

4. **Use Callbacks com Moderação**: Callbacks pesados podem impactar performance.

5. **Documente IDs Customizados**: Mantenha registro dos IDs de suas dimensões e portais.

---

## Troubleshooting

### Problema: Dimensão não aparece
- Certifique-se de registrá-la com `registerDimension()`
- Verifique se o namespace é válido

### Problema: Portal não funciona
- Verifique se a dimensão destino existe
- Confirme que o frameBlock está correto
- Teste se `requiresCompleteFrame` é apropriado

### Problema: Terreno não gera corretamente
- Verifique o `reliefType` selecionado
- Confirm os materiais em `TerrainMaterials`
- Teste diferentes `verticalChunkSize`

---

## Versão e Compatibilidade

- **Versão API**: 1.0.0
- **Minecraft Bedrock**: Compatible com versões 1.20+
- **Dependência**: `@minecraft/server` v2.8.0+

---

## Suporte e Contribuição

- 📧 Issues: [GitHub Issues](https://github.com/TheLuke013/CustomDimensionAPI/issues)
- 🎬 Tutoriais: [YouTube - TheLuke013](https://www.youtube.com/c/Lukinhas013)

---

**Última atualização**: Abril 2026 | Documento v1.0
