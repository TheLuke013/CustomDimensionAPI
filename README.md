# Custom Dimension API

Uma API poderosa para criar dimensões personalizadas em Minecraft Bedrock usando scripts com programação orientada a objetos. Crie dimensões únicas com terrenos customizados, portais personalizados e controle total sobre a geração de mundo.

> ⚠️ **Crédito obrigatório**: Use esta API livremente em seus addons, mas dê crédito a [TheLuke013](https://www.youtube.com/c/Lukinhas013). Modificações do código são permitidas desde que o crédito seja mantido.

## Características Principais

- ✨ **Dimensões Personalizadas**: Crie dimensões com terrenos únicos usando programação OOP
- 🌍 **Geração de Terreno Avançada**: Suporte para vários tipos de relevo (montanhas, ilhas, planícies, etc)
- 🔮 **Sistema de Portais**: Crie portais funcionais para suas dimensões personalizadas
- ⚙️ **Controle Total**: Configure mobs, minérios, estruturas e muito mais
- 🎨 **Materiais Customizáveis**: Define blocos de superfície, camadas e base
- 📦 **Tamanho Vertical Configurável**: Escolha entre LOW (32), MEDIUM (64) ou HIGH (128)

## Instalação Rápida

1. Clone ou baixe este repositório
2. Integre ao seu addon Minecraft Bedrock
3. Importe o `DimensionAPI.js` em seu script principal
4. Comece a criar dimensões!

```javascript
import { 
  CustomDimension, 
  CustomDimensionManager,
  TerrainMaterials,
  VerticalChunkSize,
  ReliefType 
} from './dimension_api/dimension/CustomDimension.js';
```

## Uso Básico

### Criar uma Dimensão Simples

```javascript
const dimManager = new CustomDimensionManager();

const meuMundo = new CustomDimension(
  "meu_addon:meu_mundo",
  new TerrainMaterials(),
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.MEDIUM,
  ReliefType.HILLS
);

dimManager.registerDimension(meuMundo);
```

### Configurar Terreno Personalizado

```javascript
const terreno = new TerrainMaterials(
  "purpur_block",      // Bloco superior
  "end_stone",         // Camada média
  "end_stone",         // Camada inferior
  "bedrock"            // Base
);

const dimensao = new CustomDimension(
  "meu_addon:end_world",
  terreno,
  { x: 0, y: 64, z: 0 },
  VerticalChunkSize.HIGH,
  ReliefType.MOUNTAINS
);
```

### Criar um Portal

```javascript
import { 
  CustomPortal, 
  CustomPortalManager,
  PortalType 
} from './dimension_api/portal/CustomPortal.js';

const portalManager = new CustomPortalManager();

const portal = new CustomPortal(
  "meu_addon:meu_portal",
  PortalType.NETHER,
  "mossy_cobblestone",           // Bloco de moldura
  "meu_addon:meu_portal_block",  // Bloco do portal
  "flint_and_steel",             // Item para ativar
  "meu_addon:meu_mundo",         // Dimensão destino
  false                          // Requer frame completo?
);

portalManager.registerPortal(portal);
```

## Documentação Completa

Para uma documentação detalhada sobre todas as classes, métodos e opções, veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Exemplos

Explore a pasta `example/` para ver implementações completas:
- `Dimensions.js` - Criar múltiplas dimensões
- `Portals.js` - Configurar portais
- `Ores.js` - Gerenciar features e minérios

## Estrutura do Projeto

```
BP/Custom Dimension API/
├── scripts/
│   ├── DimensionAPI.js           # Ponto de entrada principal
│   ├── dimension_api/
│   │   ├── dimension/            # Sistema de dimensões
│   │   ├── portal/               # Sistema de portais
│   │   ├── utils/                # Utilitários
│   │   └── data/                 # Dados adicionais
│   └── example/                  # Exemplos de uso
├── feature_rules/                # Regras de features
├── features/                     # Definições de features
├── blocks/                       # Blocos customizados
└── manifest.json
```

## Tipos de Relevo Disponíveis

- `FLAT` - Totalmente plano
- `HILLS` - Colinas suaves
- `MOUNTAINS` - Montanhas altas
- `PLAINS` - Planícies levemente onduladas
- `ISLAND_CHAIN` - Cadeia de ilhas
- `OCEAN` - Oceano profundo
- `HILLS_WITH_RIVERS` - Colinas com rios sinuosos

## Tamanho Vertical de Chunks

- `LOW` - 32 blocos de altura
- `MEDIUM` - 64 blocos de altura
- `HIGH` - 128 blocos de altura

## Opções de Dimensão

```javascript
dimension.canGenerateTerrain = true;          // Gerar terreno?
dimension.canGenerateCommonFeatures = true;   // Gerar estruturas?
dimension.canGenerateVanillaOres = true;      // Gerar minérios vanilla?
dimension.canGeneratePortal = true;           // Gerar portal?
dimension.canGenerateLakes = true;            // Gerar lagos?
dimension.canSpawnVanillaMobs = true;         // Spawnar mobs vanilla?
dimension.maxChunks = 128;                    // Máximo de chunks (modo FIXED)
dimension.dimensionFog = '';                  // Efeito de neblina customizado
```

## Contribuindo

Encontrou um bug? Tem sugestões? Abra uma issue no [repositório GitHub](https://github.com/TheLuke013/CustomDimensionAPI/issues).

## Licença

ISC - Veja LICENSE para detalhes

## Autor

Desenvolvido por **TheLuke013** - [YouTube](https://www.youtube.com/c/Lukinhas013) | [GitHub](https://github.com/TheLuke013)

---

**Última atualização**: Abril 2026
