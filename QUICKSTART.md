# Guia de Início Rápido - Custom Dimension API

Um guia prático e direto para começar a criar dimensões em minutos.

## ⚡ Setup Inicial (3 passos)

### 1. Importe a API

```javascript
// main.js
import './DimensionAPI.js';
```

### 2. Crie uma Dimensão

```javascript
// Suas dimensões aqui
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';

const manager = new CustomDimensionManager();

const myDimension = new CustomDimension(
  "addon:my_dimension",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS
);

manager.registerDimension(myDimension);
```

### 3. Pronto! 🎉

Sua dimensão está criada e funcionando.

---

## 🎨 Personalizações Básicas

### Mudar Terreno

```javascript
const myDimension = new CustomDimension(
  "addon:custom_terrain",
  new TerrainMaterials(
    "purple_concrete",    // Topo
    "pink_concrete",      // Meio
    "magenta_concrete",   // Base
    "bedrock"             // Fundação
  ),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.MOUNTAINS
);
```

### Diferentes Tipos de Relevo

```javascript
// Opção 1: Plano
new CustomDimension(..., ReliefType.FLAT);

// Opção 2: Montanhas
new CustomDimension(..., ReliefType.MOUNTAINS);

// Opção 3: Ilhas
new CustomDimension(..., ReliefType.ISLAND_CHAIN);

// Opção 4: Colinas com rios
new CustomDimension(..., ReliefType.HILLS_WITH_RIVERS);
```

---

## 🚀 Recursos Comuns

### Desabilitar Mobs Vanilla

```javascript
myDimension.canSpawnVanillaMobs = false;
```

### Desabilitar Minérios Vanilla

```javascript
myDimension.canGenerateVanillaOres = false;
```

### Remover Estruturas

```javascript
myDimension.canGenerateCommonFeatures = false;
```

### Sem Lagos

```javascript
myDimension.canGenerateLakes = false;
```

### Dimensão Infinita

```javascript
const infiniteDim = new CustomDimension(
  "addon:infinite",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS,
  WorldType.CUSTOM,
  GenerationType.DYNAMIC  // ← Infinita!
);
```

---

## 🔮 Criar Portais

### Portal Simples

```javascript
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

const portalManager = new CustomPortalManager();

const portal = new CustomPortal(
  "addon:meu_portal",
  PortalType.NETHER,
  "obsidian",
  "portal",
  "flint_and_steel",
  "addon:my_dimension",
  true
);

portalManager.registerPortal(portal);
```

### Qual o Tipo de Bloco de Portal?

| PortalType | Bloco de Moldura | Bloco do Portal |
|-----------|------------------|-----------------|
| `NETHER` | `obsidian` | `portal` |
| `THE_END` | `end_portal_frame` | `end_portal` |
| Customizado | Qualquer | Qualquer |

---

## 🎮 Receitas Rápidas

### Mundo Tipo Nether Customizado

```javascript
const customNether = new CustomDimension(
  "addon:nether_world",
  new TerrainMaterials(
    "netherrack",
    "netherrack",
    "netherrack",
    "bedrock"
  ),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.MOUNTAINS
);

customNether.canSpawnVanillaMobs = false;
customNether.canGenerateVanillaOres = false;
customNether.dimensionFog = 'nether_fog';
```

### Mundo Tipo End Customizado

```javascript
const customEnd = new CustomDimension(
  "addon:end_world",
  new TerrainMaterials(
    "end_stone",
    "end_stone",
    "purpur_block",
    "bedrock"
  ),
  { x: 0, y: 100, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.ISLAND_CHAIN
);

customEnd.canSpawnVanillaMobs = false;
customEnd.canGenerateVanillaOres = false;
```

### Mundo de Céu Flutuante

```javascript
const skyWorld = new CustomDimension(
  "addon:sky_realm",
  new TerrainMaterials(
    "grass_block",
    "dirt",
    "stone",
    "bedrock"
  ),
  { x: 0, y: 200, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.ISLAND_CHAIN
);

skyWorld.maxChunks = 256;
```

### Mundo Subterrâneo

```javascript
const underworld = new CustomDimension(
  "addon:underworld",
  new TerrainMaterials(
    "deepslate",
    "deepslate",
    "deepslate",
    "bedrock"
  ),
  { x: 0, y: 32, z: 0 },
  VerticalChunkSize.LOW,
  ReliefType.OCEAN
);
```

---

## 📊 Tamanhos de Chunks

```javascript
VerticalChunkSize.LOW      // 32 blocos - Compacto
VerticalChunkSize.MEDIUM   // 64 blocos - Recomendado
VerticalChunkSize.HIGH     // 128 blocos - Alto
```

---

## 📋 Checklist de Criação

- [ ] Importar classes da API
- [ ] Criar `CustomDimensionManager`
- [ ] Instanciar `CustomDimension`
- [ ] Configurar materiais (opcional)
- [ ] Definir spawn (opcional)
- [ ] Registrar dimensão
- [ ] Criar portal (opcional)
- [ ] Testar no jogo

---

## 🐛 Soluções Rápidas

| Problema | Solução |
|----------|---------|
| Dimensão não aparece | Verificar `registerDimension()` |
| Terreno estranho | Tentar outro `ReliefType` |
| Muitos mobs | Desabilitar `canSpawnVanillaMobs` |
| Muitos recursos | Desabilitar `canGenerateVanillaOres` |
| Portal não funciona | Verificar `destinationDimension` |

---

## 📚 Próximos Passos

1. Leia [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para recursos avançados
2. Explore a pasta `example/` para ver implementações completas
3. Experimente diferentes combinações de terreno e relief
4. Crie uma rede de múltiplos portais
5. Customize com callbacks e eventos

---

## 💡 Dicas Profissionais

**Dica 1: Use Constantes**
```javascript
const ADDON_PREFIX = "meu_addon";
const MyDimensions = {
  FOREST: `${ADDON_PREFIX}:forest`,
  DESERT: `${ADDON_PREFIX}:desert`,
  SKY: `${ADDON_PREFIX}:sky`
};
```

**Dica 2: Organize Dimensões em Arquivo Separado**
```javascript
// dimensions.js
export const setupDimensions = () => {
  const manager = new CustomDimensionManager();
  // ... setup aqui
};

// main.js
import { setupDimensions } from './dimensions.js';
setupDimensions();
```

**Dica 3: Use Callbacks para Feedback**
```javascript
dimension.onEnters = (player) => {
  player.sendMessage("§6Bem-vindo!");
};
```

---

**Pronto para criar dimensões incríveis? 🚀**

Dúvidas? Veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md) ou abra uma issue no GitHub.
