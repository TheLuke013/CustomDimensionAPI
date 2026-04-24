# Cheat Sheet - Custom Dimension API

Referência rápida de sintaxe e comandos da API.

## 📌 Imports Básicos

```javascript
// Dimensões
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType,
  WorldType,
  GenerationType
} from './dimension_api/dimension/CustomDimension.js';

// Portais
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

// Features
import { FeaturesManager } from './dimension_api/dimension/FeaturesManager.js';
```

---

## 🌍 Criar Dimensão (Sintaxe Básica)

```javascript
const dim = new CustomDimension(
  "addon:dimension_id",           // ID único
  new TerrainMaterials(),         // Materiais
  { x: 0, y: 64, z: 0 },         // Spawn
  VerticalChunkSize.MEDIUM,       // Altura
  ReliefType.HILLS                // Relevo
);

const manager = new CustomDimensionManager();
manager.registerDimension(dim);
```

---

## 🏗️ TerrainMaterials (Construtor)

```javascript
new TerrainMaterials(
  "bloco_topo",      // Top material
  "bloco_meio",      // Mid material
  "bloco_base",      // Bottom material
  "bedrock"          // Base material (opcional)
)
```

**Exemplo prático:**
```javascript
// Dimensão roxo/pink
new TerrainMaterials(
  "purple_concrete",
  "magenta_concrete",
  "pink_concrete",
  "bedrock"
)

// End customizada
new TerrainMaterials(
  "end_stone",
  "end_stone",
  "purpur_block",
  "bedrock"
)
```

---

## 📏 Tamanhos de Chunk

| Constante | Altura | Uso |
|-----------|--------|-----|
| `VerticalChunkSize.LOW` | 32 | Compacto |
| `VerticalChunkSize.MEDIUM` | 64 | Recomendado |
| `VerticalChunkSize.HIGH` | 128 | Alto |

---

## 🏔️ Tipos de Relevo

| Tipo | Descrição |
|------|-----------|
| `ReliefType.FLAT` | Totalmente plano |
| `ReliefType.HILLS` | Colinas suaves |
| `ReliefType.MOUNTAINS` | Montanhas altas |
| `ReliefType.PLAINS` | Planícies levemente onduladas |
| `ReliefType.ISLAND_CHAIN` | Cadeia de ilhas |
| `ReliefType.OCEAN` | Oceano profundo |
| `ReliefType.HILLS_WITH_RIVERS` | Colinas com rios |

---

## 🌐 Tipos de Mundo

| Tipo | Descrição |
|------|-----------|
| `WorldType.OVERWORLD` | Tipo Overworld |
| `WorldType.NETHER` | Tipo Nether |
| `WorldType.END` | Tipo End |
| `WorldType.CUSTOM` | Customizado |

---

## 🎲 Tipos de Geração

| Tipo | Descrição | maxChunks |
|------|-----------|-----------|
| `GenerationType.FIXED` | Tamanho limitado | Sim (padrão 128) |
| `GenerationType.DYNAMIC` | Tamanho infinito | Não |

---

## 🔧 Propriedades de Dimensão

```javascript
// Geração
dim.canGenerateTerrain = true;          // Gerar terreno?
dim.canGenerateCommonFeatures = true;   // Estruturas?
dim.canGenerateVanillaOres = true;      // Minérios?
dim.canGeneratePortal = true;           // Portal?
dim.canGenerateLakes = true;            // Lagos?
dim.canSpawnVanillaMobs = true;         // Mobs?

// Configuração
dim.maxChunks = 128;                    // Máx chunks (FIXED)
dim.dimensionFog = '';                  // Neblina customizada

// Callbacks
dim.onFirstGeneration = callback;       // Primeira geração
dim.onEnters = callback;                // Jogador entra
dim.onLeaves = callback;                // Jogador sai
dim.onChunkGeneration = callback;       // Chunk gerado
```

---

## 🔮 Criar Portal

```javascript
const portal = new CustomPortal(
  "addon:portal_id",              // ID único
  PortalType.NETHER,              // Tipo
  "obsidian",                     // Bloco moldura
  "portal",                       // Bloco portal
  "flint_and_steel",              // Item ativação
  "addon:destination_dimension",  // Dimensão destino
  true                            // Requer frame completo?
);

const portalManager = new CustomPortalManager();
portalManager.registerPortal(portal);
```

---

## 🎭 Tipos de Portal

| Tipo | Frame | Portal | Item |
|------|-------|--------|------|
| `PortalType.NETHER` | obsidian | portal | flint_and_steel |
| `PortalType.THE_END` | end_portal_frame | end_portal | eye_of_ender |

---

## 🎪 Portais Predefinidos (Receitas)

### Nether Portal
```javascript
new CustomPortal(
  "addon:nether",
  PortalType.NETHER,
  "obsidian",
  "portal",
  "flint_and_steel",
  "addon:nether_dim",
  true
)
```

### End Portal
```javascript
new CustomPortal(
  "addon:end",
  PortalType.THE_END,
  "end_portal_frame",
  "end_portal",
  "eye_of_ender",
  "addon:end_dim",
  false
)
```

### Portal Customizado
```javascript
new CustomPortal(
  "addon:custom",
  PortalType.NETHER,
  "purple_concrete",
  "magenta_concrete",
  "amethyst_shard",
  "addon:magic_dim",
  false
)
```

---

## 🔴 Quick Disable (Disabilitar Tudo)

```javascript
dimension.canGenerateTerrain = false;
dimension.canGenerateCommonFeatures = false;
dimension.canGenerateVanillaOres = false;
dimension.canGeneratePortal = false;
dimension.canGenerateLakes = false;
dimension.canSpawnVanillaMobs = false;
```

---

## 🟢 Quick Enable (Habilitar Tudo)

```javascript
dimension.canGenerateTerrain = true;
dimension.canGenerateCommonFeatures = true;
dimension.canGenerateVanillaOres = true;
dimension.canGeneratePortal = true;
dimension.canGenerateLakes = true;
dimension.canSpawnVanillaMobs = true;
```

---

## 👁️ Callbacks Rápidos

```javascript
// Bem-vindo
dim.onEnters = (player) => {
  player.sendMessage("Bem-vindo!");
};

// Despedida
dim.onLeaves = (player) => {
  console.log(player.name + " saiu");
};

// Geração
dim.onChunkGeneration = (chunk) => {
  console.log(`Chunk ${chunk.x},${chunk.z}`);
};

// Primeira vez
dim.onFirstGeneration = (dimension) => {
  console.log("Dimensão criada!");
};
```

---

## 📋 Templates Prontos

### Template: Dimensão Simples
```javascript
const simple = new CustomDimension(
  "addon:simple",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS
);
manager.registerDimension(simple);
```

### Template: Dimensão Colorida
```javascript
const colored = new CustomDimension(
  "addon:colored",
  new TerrainMaterials("TOPO", "MEIO", "BASE", "bedrock"),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.FLAT
);
manager.registerDimension(colored);
```

### Template: Dimensão Infinita
```javascript
const infinite = new CustomDimension(
  "addon:infinite",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS,
  WorldType.CUSTOM,
  GenerationType.DYNAMIC
);
manager.registerDimension(infinite);
```

### Template: Dimensão Limitada
```javascript
const limited = new CustomDimension(
  "addon:limited",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.FLAT,
  WorldType.CUSTOM,
  GenerationType.FIXED
);
limited.maxChunks = 64;
manager.registerDimension(limited);
```

---

## 🎯 Padrão: Factory

```javascript
class Dims {
  static grass(id) {
    return new CustomDimension(id, 
      new TerrainMaterials("grass_block", "dirt", "stone", "bedrock"),
      { x: 0, y: 64, z: 0 }, VerticalChunkSize.MEDIUM, ReliefType.HILLS);
  }
  
  static desert(id) {
    return new CustomDimension(id,
      new TerrainMaterials("sand", "sand", "sandstone", "bedrock"),
      { x: 0, y: 64, z: 0 }, VerticalChunkSize.MEDIUM, ReliefType.PLAINS);
  }
}

// Uso
manager.registerDimension(Dims.grass("addon:grass"));
manager.registerDimension(Dims.desert("addon:desert"));
```

---

## 🔄 Constantes Úteis

```javascript
// Configuração padrão recomendada
const DEFAULT_CONFIG = {
  size: VerticalChunkSize.MEDIUM,
  relief: ReliefType.HILLS,
  type: WorldType.CUSTOM,
  generation: GenerationType.FIXED,
  maxChunks: 128,
  canSpawnMobs: true,
  canGenerateOres: true
};

// Modo "vazio"
const EMPTY_CONFIG = {
  size: VerticalChunkSize.LOW,
  relief: ReliefType.FLAT,
  canSpawnMobs: false,
  canGenerateOres: false,
  canGenerateLakes: false,
  canGenerateFeatures: false
};
```

---

## 🐛 Debug Rápido

```javascript
// Log de todas dimensões
manager.dimensions.forEach(d => {
  console.log(d.namespace);
});

// Log de todas portais
portalManager.portals.forEach(p => {
  console.log(p.namespace + " → " + p.destinationDimension);
});

// Verificar propriedades
console.log(dim.VerticalChunkSize);
console.log(dim.reliefType);
console.log(dim.generationType);
```

---

## ⚡ One-Liners

```javascript
// Criar e registrar em uma linha
manager.registerDimension(
  new CustomDimension("addon:quick", new TerrainMaterials(), 
  { x: 0, y: 64, z: 0 }, VerticalChunkSize.MEDIUM, ReliefType.HILLS)
);

// Criar portal e registrar em uma linha
portalManager.registerPortal(
  new CustomPortal("addon:qp", PortalType.NETHER, "obsidian", 
  "portal", "flint_and_steel", "addon:dim", true)
);

// Loop de múltiplas dimensões
["dim1", "dim2", "dim3"].forEach(id => 
  manager.registerDimension(
    new CustomDimension(`addon:${id}`, new TerrainMaterials(), 
    { x: 0, y: 64, z: 0 }, VerticalChunkSize.MEDIUM, ReliefType.HILLS)
  )
);
```

---

## 📚 Links Rápidos

- [README](README.md) - Visão geral
- [QUICKSTART](QUICKSTART.md) - Início rápido  
- [API_DOCUMENTATION](API_DOCUMENTATION.md) - Referência completa
- [EXAMPLES](EXAMPLES.md) - Exemplos práticos
- [DOCUMENTATION_MAP](DOCUMENTATION_MAP.md) - Mapa de docs
- [CONTRIBUTING](CONTRIBUTING.md) - Como contribuir

---

## 🎨 Paletas de Blocos Prontas

```javascript
// Roxo/Pink
new TerrainMaterials("purple_concrete", "magenta_concrete", "pink_concrete", "bedrock")

// Azul/Cian
new TerrainMaterials("blue_concrete", "cyan_concrete", "light_blue_concrete", "bedrock")

// Verde
new TerrainMaterials("lime_concrete", "green_concrete", "emerald_block", "bedrock")

// Fogo/Lava
new TerrainMaterials("red_concrete", "orange_concrete", "magma_block", "bedrock")

// Gelo
new TerrainMaterials("snow_block", "ice", "packed_ice", "bedrock")

// Roxo End
new TerrainMaterials("end_stone", "end_stone", "purpur_block", "bedrock")
```

---

## ✅ Checklist de Implementação

- [ ] Importar classes necessárias
- [ ] Criar CustomDimensionManager
- [ ] Criar CustomDimension(s)
- [ ] Registrar dimensão(ões)
- [ ] Criar portal(s) (opcional)
- [ ] Registrar portal(s) (opcional)
- [ ] Testar no jogo
- [ ] Ajustar configurações conforme necessário

---

**Bookmark esta página para referência rápida!** 📌

Última atualização: Abril 2026
