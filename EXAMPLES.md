# Exemplos Práticos - Custom Dimension API

Coleção de exemplos prontos para usar e adaptar em seus projetos.

## Índice

1. [Exemplos Básicos](#exemplos-básicos)
2. [Exemplos Intermediários](#exemplos-intermediários)
3. [Exemplos Avançados](#exemplos-avançados)
4. [Padrões Comuns](#padrões-comuns)

---

## Exemplos Básicos

### Exemplo 1: Seu Primeiro Mundo

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

// Criar uma dimensão simples
const firstWorld = new CustomDimension(
  "tutorial:first_world",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS
);

manager.registerDimension(firstWorld);
```

**Resultado**: Uma dimensão com terreno tipo Overworld padrão, colinas suaves.

---

### Exemplo 2: Mundo com Cores

```javascript
const colorWorld = new CustomDimension(
  "tutorial:color_world",
  new TerrainMaterials(
    "purple_concrete",
    "magenta_concrete",
    "pink_concrete",
    "bedrock"
  ),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.FLAT
);

const manager = new CustomDimensionManager();
manager.registerDimension(colorWorld);
```

**Resultado**: Um mundo plano totalmente roxo/magenta.

---

### Exemplo 3: Mundo com Ouro

```javascript
const goldWorld = new CustomDimension(
  "tutorial:gold_world",
  new TerrainMaterials(
    "gold_block",
    "gold_ore",
    "raw_gold_block",
    "bedrock"
  ),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.MOUNTAINS
);

const manager = new CustomDimensionManager();
manager.registerDimension(goldWorld);
```

**Resultado**: Um mundo de ouro com montanhas altas.

---

## Exemplos Intermediários

### Exemplo 4: Sistema Multi-Mundo

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType,
  WorldType,
  GenerationType
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

// Definir múltiplas dimensões
const worlds = [
  {
    id: "multiworld:forest",
    top: "grass_block",
    mid: "dirt",
    bottom: "stone",
    spawn: { x: 0, y: 100, z: 0 },
    relief: ReliefType.HILLS
  },
  {
    id: "multiworld:desert",
    top: "sand",
    mid: "sand",
    bottom: "sandstone",
    spawn: { x: 0, y: 100, z: 500 },
    relief: ReliefType.PLAINS
  },
  {
    id: "multiworld:snow",
    top: "snow_block",
    mid: "ice",
    bottom: "packed_ice",
    spawn: { x: 500, y: 100, z: 0 },
    relief: ReliefType.MOUNTAINS
  }
];

worlds.forEach(w => {
  const dim = new CustomDimension(
    w.id,
    new TerrainMaterials(w.top, w.mid, w.bottom, "bedrock"),
    w.spawn,
    VerticalChunkSize.MEDIUM,
    w.relief
  );
  manager.registerDimension(dim);
});
```

---

### Exemplo 5: Portais Conectados

```javascript
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';

// Setup de dimensões
const dimManager = new CustomDimensionManager();
const portalManager = new CustomPortalManager();

// Criar hub
const hub = new CustomDimension(
  "portals:hub",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.FLAT
);

// Criar mundo destino
const realm1 = new CustomDimension(
  "portals:realm_1",
  new TerrainMaterials("grass_block", "dirt", "stone", "bedrock"),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.MOUNTAINS
);

dimManager.registerDimension(hub);
dimManager.registerDimension(realm1);

// Criar portal hub → realm_1
const portalToRealm1 = new CustomPortal(
  "portals:to_realm_1",
  PortalType.NETHER,
  "obsidian",
  "portal",
  "flint_and_steel",
  "portals:realm_1",
  true
);

portalManager.registerPortal(portalToRealm1);
```

---

### Exemplo 6: Dimensão com Configurações Customizadas

```javascript
const customizedDim = new CustomDimension(
  "custom:advanced",
  new TerrainMaterials(
    "mymod:grass_block",
    "mymod:dirt_block",
    "mymod:stone_block",
    "bedrock"
  ),
  { x: 100, y: 80, z: 200 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS_WITH_RIVERS
);

// Desabilitar features específicas
customizedDim.canGenerateTerrain = true;          // ✓ Gerar terreno
customizedDim.canGenerateCommonFeatures = false;  // ✗ Sem estruturas
customizedDim.canGenerateVanillaOres = false;     // ✗ Sem minérios vanilla
customizedDim.canGenerateLakes = false;           // ✗ Sem lagos
customizedDim.canSpawnVanillaMobs = false;        // ✗ Sem mobs vanilla
customizedDim.canGeneratePortal = true;           // ✓ Portal gerado

// Limitar tamanho
customizedDim.maxChunks = 64;

// Adicionar efeito
customizedDim.dimensionFog = 'custom_fog';

// Registrar
const manager = new CustomDimensionManager();
manager.registerDimension(customizedDim);
```

---

## Exemplos Avançados

### Exemplo 7: Dimensão com Eventos

```javascript
import { world } from "@minecraft/server";
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

const eventDim = new CustomDimension(
  "events:dimension",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS
);

// Evento 1: Primeira geração
eventDim.onFirstGeneration = (dimension) => {
  console.log(`[FIRST GENERATION] Dimensão ${dimension.namespace} criada!`);
};

// Evento 2: Jogador entra
eventDim.onEnters = (player) => {
  player.sendMessage("§6━━━━━━━━━━━━━━━━━━━━");
  player.sendMessage("§e✓ Bem-vindo ao Evento Dimension!");
  player.sendMessage("§6━━━━━━━━━━━━━━━━━━━━");
  
  // Dar item
  player.getComponent("inventory").container.addItem(
    new ItemStack("compass", 1)
  );
};

// Evento 3: Jogador sai
eventDim.onLeaves = (player) => {
  console.log(`[LEAVE] ${player.name} saiu da dimensão`);
};

// Evento 4: Chunk gerado
eventDim.onChunkGeneration = (chunk) => {
  console.log(`[CHUNK GENERATED] ${chunk.x},${chunk.z}`);
};

manager.registerDimension(eventDim);
```

---

### Exemplo 8: Rede de Portais Hub

```javascript
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';

const dimManager = new CustomDimensionManager();
const portalManager = new CustomPortalManager();

// Hub central
const hub = new CustomDimension(
  "network:hub",
  new TerrainMaterials("purpur_block", "purpur_block", "purpur_block", "bedrock"),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.FLAT
);

// Realms
const realms = [
  { id: "network:forest", top: "grass_block", relief: ReliefType.HILLS },
  { id: "network:desert", top: "sand", relief: ReliefType.PLAINS },
  { id: "network:ice", top: "snow_block", relief: ReliefType.MOUNTAINS },
  { id: "network:nether", top: "netherrack", relief: ReliefType.OCEAN }
];

dimManager.registerDimension(hub);

// Criar realms e portais
const portalConfig = [
  { id: "network:portal_forest", frame: "oak_log", portal: "emerald_block", item: "emerald" },
  { id: "network:portal_desert", frame: "sandstone", portal: "sand", item: "golden_apple" },
  { id: "network:portal_ice", frame: "packed_ice", portal: "blue_ice", item: "snowball" },
  { id: "network:portal_nether", frame: "netherrack", portal: "portal", item: "flint_and_steel" }
];

realms.forEach((realm, index) => {
  // Criar realm
  const dim = new CustomDimension(
    realm.id,
    new TerrainMaterials(realm.top, "dirt", "stone", "bedrock"),
    { x: 0, y: 64, z: 0 },
    VerticalChunkSize.MEDIUM,
    realm.relief
  );
  dimManager.registerDimension(dim);

  // Criar portal
  const config = portalConfig[index];
  const portal = new CustomPortal(
    config.id,
    PortalType.NETHER,
    config.frame,
    config.portal,
    config.item,
    realm.id,
    false
  );
  portalManager.registerPortal(portal);
});

console.log("✓ Network de 4 realms criada!");
```

---

### Exemplo 9: Dimensão Procedural com Altura Variável

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType,
  GenerationType 
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

// Criar múltiplas versões com alturas diferentes
const heights = [
  { size: VerticalChunkSize.LOW, name: "low" },
  { size: VerticalChunkSize.MEDIUM, name: "medium" },
  { size: VerticalChunkSize.HIGH, name: "high" }
];

heights.forEach(h => {
  const dim = new CustomDimension(
    `procedural:world_${h.name}`,
    new TerrainMaterials(),
    { x: 0, y: 64, z: 0 },
    h.size,
    ReliefType.MOUNTAINS,
    "custom",
    GenerationType.DYNAMIC
  );
  
  manager.registerDimension(dim);
  console.log(`✓ Dimensão procedural ${h.name} criada`);
});
```

---

## Padrões Comuns

### Padrão 1: Factory Pattern para Dimensões

```javascript
class DimensionFactory {
  static createGrassDimension(id) {
    return new CustomDimension(
      id,
      new TerrainMaterials("grass_block", "dirt", "stone", "bedrock"),
      { x: 0, y: 64, z: 0 },
      VerticalChunkSize.MEDIUM,
      ReliefType.HILLS
    );
  }

  static createDesertDimension(id) {
    return new CustomDimension(
      id,
      new TerrainMaterials("sand", "sand", "sandstone", "bedrock"),
      { x: 0, y: 64, z: 0 },
      VerticalChunkSize.MEDIUM,
      ReliefType.PLAINS
    );
  }

  static createSnowDimension(id) {
    return new CustomDimension(
      id,
      new TerrainMaterials("snow_block", "ice", "packed_ice", "bedrock"),
      { x: 0, y: 64, z: 0 },
      VerticalChunkSize.MEDIUM,
      ReliefType.MOUNTAINS
    );
  }
}

// Uso
const manager = new CustomDimensionManager();
manager.registerDimension(DimensionFactory.createGrassDimension("factory:grass"));
manager.registerDimension(DimensionFactory.createDesertDimension("factory:desert"));
```

---

### Padrão 2: Builder Pattern para Dimensões

```javascript
class DimensionBuilder {
  constructor(id) {
    this.config = {
      id,
      materials: new TerrainMaterials(),
      spawn: { x: 0, y: 64, z: 0 },
      size: VerticalChunkSize.MEDIUM,
      relief: ReliefType.HILLS,
      type: WorldType.CUSTOM,
      generation: GenerationType.FIXED
    };
  }

  setMaterials(top, mid, bottom, base) {
    this.config.materials = new TerrainMaterials(top, mid, bottom, base);
    return this;
  }

  setSpawn(x, y, z) {
    this.config.spawn = { x, y, z };
    return this;
  }

  setSize(size) {
    this.config.size = size;
    return this;
  }

  setRelief(relief) {
    this.config.relief = relief;
    return this;
  }

  build() {
    return new CustomDimension(
      this.config.id,
      this.config.materials,
      this.config.spawn,
      this.config.size,
      this.config.relief,
      this.config.type,
      this.config.generation
    );
  }
}

// Uso
const customDim = new DimensionBuilder("builder:custom")
  .setMaterials("purple_concrete", "pink_concrete", "magenta_concrete", "bedrock")
  .setSpawn(100, 80, 200)
  .setSize(VerticalChunkSize.HIGH)
  .setRelief(ReliefType.MOUNTAINS)
  .build();

const manager = new CustomDimensionManager();
manager.registerDimension(customDim);
```

---

### Padrão 3: Configuração via Objetos

```javascript
const DIMENSIONS_CONFIG = {
  forest: {
    id: "config:forest",
    materials: { top: "grass_block", mid: "dirt", bottom: "stone", base: "bedrock" },
    spawn: { x: 0, y: 64, z: 0 },
    size: VerticalChunkSize.MEDIUM,
    relief: ReliefType.HILLS,
    features: { mobs: false, ores: false, lakes: false }
  },
  desert: {
    id: "config:desert",
    materials: { top: "sand", mid: "sand", bottom: "sandstone", base: "bedrock" },
    spawn: { x: 0, y: 64, z: 0 },
    size: VerticalChunkSize.MEDIUM,
    relief: ReliefType.PLAINS,
    features: { mobs: true, ores: false, lakes: false }
  }
};

function setupFromConfig() {
  const manager = new CustomDimensionManager();
  
  Object.values(DIMENSIONS_CONFIG).forEach(config => {
    const dim = new CustomDimension(
      config.id,
      new TerrainMaterials(
        config.materials.top,
        config.materials.mid,
        config.materials.bottom,
        config.materials.base
      ),
      config.spawn,
      config.size,
      config.relief
    );

    // Aplicar features
    dim.canSpawnVanillaMobs = config.features.mobs;
    dim.canGenerateVanillaOres = config.features.ores;
    dim.canGenerateLakes = config.features.lakes;

    manager.registerDimension(dim);
  });
}

setupFromConfig();
```

---

## Dicas para Usar os Exemplos

1. **Adapte os IDs**: Mude `tutorial:`, `events:`, etc para seu addon
2. **Teste Combinações**: Combine diferentes `ReliefType` com materiais
3. **Use Callbacks**: Adicione mensagens e lógica customizada
4. **Organize Código**: Use os padrões Factory ou Builder para manter tudo limpo
5. **Documente**: Adicione comentários explicando suas customizações

---

**Divirta-se criando dimensões incríveis!** 🚀

Mais exemplos? Verifique a pasta `example/` do projeto ou abra uma issue no GitHub.
