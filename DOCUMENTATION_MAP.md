# 📚 Mapa de Documentação

Guia completo de toda a documentação disponível para a Custom Dimension API.

## 📖 Arquivos de Documentação

### 1. **README.md** ⭐ Comece aqui!
   - Visão geral do projeto
   - Características principais
   - Instalação rápida
   - Exemplo básico
   - Links para documentação adicional

   **Melhor para**: Entender o que é a API e começar rapidamente.

---

### 2. **QUICKSTART.md** ⚡ Início em minutos
   - Setup em 3 passos
   - Personalizações básicas
   - Receitas prontas para usar
   - Troubleshooting rápido
   - Checklist de criação

   **Melhor para**: Criar sua primeira dimensão rapidamente.

   **Exemplo**:
   ```javascript
   const myDim = new CustomDimension(
     "addon:my_dimension",
     new TerrainMaterials(),
     { x: 0, y: 64, z: 0 },
     VerticalChunkSize.MEDIUM,
     ReliefType.HILLS
   );
   ```

---

### 3. **API_DOCUMENTATION.md** 📚 Referência Completa
   - Documentação técnica de todas as classes
   - Descrição detalhada de cada método
   - Parâmetros e tipos
   - Exemplos de código
   - Boas práticas
   - Troubleshooting avançado

   **Melhor para**: Entender profundamente como usar cada recurso da API.

   **Seções**:
   - Sistema de Dimensões
   - Sistema de Portais
   - Gerenciamento de Features
   - Eventos e Callbacks
   - Utilitários
   - Exemplos Avançados

---

### 4. **EXAMPLES.md** 💡 Exemplos Práticos
   - Exemplos básicos pronto-para-usar
   - Exemplos intermediários
   - Exemplos avançados
   - Padrões de design (Factory, Builder, etc)
   - Dicas de implementação

   **Melhor para**: Encontrar código pronto para adaptar seu projeto.

   **Categorias**:
   - 3 exemplos básicos
   - 3 exemplos intermediários
   - 3 exemplos avançados
   - 3 padrões de design

---

## 🗺️ Fluxo de Aprendizado Recomendado

### Para Iniciantes:
1. Leia [README.md](README.md)
2. Siga [QUICKSTART.md](QUICKSTART.md)
3. Adapte exemplos de [EXAMPLES.md](EXAMPLES.md)

### Para Desenvolvedores:
1. Revise [QUICKSTART.md](QUICKSTART.md) para referência
2. Estude [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Use [EXAMPLES.md](EXAMPLES.md) como referência de padrões

### Para Experts:
1. Consulte [API_DOCUMENTATION.md](API_DOCUMENTATION.md) conforme necessário
2. Explore [EXAMPLES.md](EXAMPLES.md) para padrões avançados
3. Estude o código-fonte em `scripts/dimension_api/`

---

## 🔍 Como Encontrar o que Precisa

### Tenho uma dúvida sobre...

**"Como criar uma dimensão?"**
→ [QUICKSTART.md](QUICKSTART.md#setup-inicial-3-passos)

**"Como criar um portal?"**
→ [QUICKSTART.md](QUICKSTART.md#-criar-portais)

**"Qual é a sintaxe exata da classe CustomDimension?"**
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md#customdimension)

**"Tenho um problema, como resolver?"**
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md#troubleshooting) ou [QUICKSTART.md](QUICKSTART.md#-soluções-rápidas)

**"Como organizar múltiplas dimensões?"**
→ [EXAMPLES.md](EXAMPLES.md#exemplo-4-sistema-multi-mundo)

**"Quais são os tipos de relevo disponíveis?"**
→ [README.md](README.md#tipos-de-relevo-disponíveis) ou [API_DOCUMENTATION.md](API_DOCUMENTATION.md#relieftype)

**"Como usar callbacks e eventos?"**
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md#eventos-e-callbacks)

**"Quero ver um exemplo completo com portais."**
→ [EXAMPLES.md](EXAMPLES.md#exemplo-5-portais-conectados)

---

## 📋 Tabela de Referência Rápida

| Conceito | README | QUICKSTART | API_DOC | EXAMPLES |
|----------|--------|-----------|---------|----------|
| Visão Geral | ✅ | | | |
| Instalação | ✅ | ✅ | | |
| Criar Dimensão | ✅ | ✅ | ✅ | ✅ |
| Tipos de Relevo | ✅ | ✅ | ✅ | |
| Materiais | | ✅ | ✅ | ✅ |
| Portais | ✅ | ✅ | ✅ | ✅ |
| Referência Técnica | | | ✅ | |
| Padrões de Design | | | | ✅ |
| Troubleshooting | | ✅ | ✅ | |
| Callbacks | | | ✅ | ✅ |

---

## 🎯 Estrutura de Arquivos do Projeto

```
CustomDimensionAPI/
├── README.md                    # 👈 Comece aqui!
├── QUICKSTART.md               # ⚡ Início rápido
├── API_DOCUMENTATION.md        # 📚 Referência completa
├── EXAMPLES.md                 # 💡 Exemplos práticos
├── DOCUMENTATION_MAP.md        # 📍 Este arquivo
│
├── BP/
│   └── Custom Dimension API/
│       ├── scripts/
│       │   ├── DimensionAPI.js           # Arquivo principal
│       │   ├── main.js                   # Entry point
│       │   ├── dimension_api/            # Core da API
│       │   │   ├── dimension/            # Sistema de dimensões
│       │   │   ├── portal/               # Sistema de portais
│       │   │   ├── utils/                # Utilitários
│       │   │   └── data/                 # Dados
│       │   └── example/                  # Exemplos de uso
│       │       ├── Dimensions.js         # Criar dimensões
│       │       ├── Portals.js            # Criar portais
│       │       └── Ores.js               # Gerenciar features
│       │
│       ├── blocks/                       # Blocos customizados
│       ├── features/                     # Definições de features
│       ├── feature_rules/                # Regras de features
│       └── manifest.json
│
├── RP/
│   └── Custom Dimension API/
│       ├── blocks.json
│       ├── models/
│       ├── sounds/
│       ├── textures/
│       └── manifest.json
│
└── package.json
```

---

## 🚀 Casos de Uso por Documentação

### Use README para:
- Entender o que é a API
- Conhecer as features principais
- Instalar e configurar
- Uma visão geral do projeto

### Use QUICKSTART para:
- Criar sua primeira dimensão em minutos
- Aprender as personalizações básicas
- Resolver problemas comuns rápido
- Ter um checklist de implementação

### Use API_DOCUMENTATION para:
- Entender a sintaxe exata de cada classe
- Conhecer todos os parâmetros disponíveis
- Ver exemplos detalhados
- Aprender boas práticas
- Implementar callbacks

### Use EXAMPLES para:
- Copiar e colar código funcionando
- Aprender padrões de design
- Ver implementações reais
- Inspiração para seu projeto
- Múltiplas abordagens para o mesmo problema

---

## 💬 Dúvidas Frequentes

**P: Por onde começo?**
R: Leia [README.md](README.md) e depois [QUICKSTART.md](QUICKSTART.md).

**P: Onde encontro todos os parâmetros de CustomDimension?**
R: Em [API_DOCUMENTATION.md](API_DOCUMENTATION.md#customdimension).

**P: Tenho um código de exemplo que preciso adaptar?**
R: Procure em [EXAMPLES.md](EXAMPLES.md) algo parecido.

**P: Como faço X com a API?**
R: Use a tabela de referência rápida acima ou o mapa de navegação.

**P: A documentação está incompleta?**
R: Abra uma issue no [GitHub](https://github.com/TheLuke013/CustomDimensionAPI/issues).

---

## 🔗 Links Úteis

- **GitHub**: https://github.com/TheLuke013/CustomDimensionAPI
- **YouTube (TheLuke013)**: https://www.youtube.com/c/Lukinhas013
- **Issues**: https://github.com/TheLuke013/CustomDimensionAPI/issues
- **Package.json**: Veja versão da API e dependências

---

## 📊 Estatísticas da Documentação

- **Total de Arquivos de Documentação**: 5
- **Exemplos de Código**: 20+
- **Classes Documentadas**: 5+ (CustomDimension, CustomPortal, etc)
- **Padrões de Design**: 3 (Factory, Builder, Config)
- **Tipos de Relevo**: 7
- **Tamanhos de Chunk**: 3

---

## ✅ Checklist de Leitura

- [ ] Li o README.md
- [ ] Completei o QUICKSTART.md
- [ ] Consultei API_DOCUMENTATION.md para detalhes
- [ ] Adaptei exemplos de EXAMPLES.md para meu projeto
- [ ] Minha dimensão está funcionando! 🎉

---

## 🎓 Próximos Passos

1. **Criar uma dimensão**: Siga [QUICKSTART.md](QUICKSTART.md)
2. **Explorar recursos avançados**: Leia [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. **Estudar padrões**: Veja [EXAMPLES.md](EXAMPLES.md)
4. **Customizar**: Use callbacks e eventos
5. **Compartilhar**: Mostre seu addon ao mundo!

---

**Divirta-se criando dimensões incríveis com a Custom Dimension API!** 🚀

Última atualização: Abril 2026
