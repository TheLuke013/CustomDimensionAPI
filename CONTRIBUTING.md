# Guia de Contribuição - Custom Dimension API

Obrigado por considerar contribuir para a Custom Dimension API! Este guia ajudará você a entender como contribuir para o projeto.

## Código de Conduta

Todos os contribuidores são esperados a respeitar os outros e manter um ambiente acolhedor.

---

## Como Contribuir

### 1. Reportar Bugs

Encontrou um bug? Abra uma issue descrevendo:

- **Título claro**: Descreva o problema em poucas palavras
- **Versão da API**: Qual versão você está usando?
- **Passos para reproduzir**: Como replicar o erro?
- **Comportamento esperado**: O que deveria acontecer?
- **Comportamento atual**: O que está acontecendo?
- **Screenshots/Logs**: Se aplicável, compartilhe logs de erro

**Template:**
```
### Descrição do Bug
[Descreva o bug de forma clara]

### Passos para Reproduzir
1. [Primeiro passo]
2. [Segundo passo]
3. [...]

### Comportamento Esperado
[Descreva o que deveria acontecer]

### Comportamento Atual
[Descreva o que está acontecendo]

### Versão
- Versão da API: X.X.X
- Versão do Minecraft: X.XX
- SO: [Windows/Mac/Linux]
```

---

### 2. Sugerir Melhorias

Tem uma ideia? Abra uma issue com a tag `enhancement`:

- **Descrição clara**: O que você gostaria adicionar?
- **Motivação**: Por que esta feature seria útil?
- **Implementação possível**: Como você implementaria isso?
- **Exemplos de uso**: Como seria usado?

**Template:**
```
### Feature Request
[Descreva a feature que gostaria]

### Motivação
[Por que isso seria útil?]

### Implementação Sugerida
[Como isso poderia ser implementado?]

### Exemplos de Uso
[Mostre exemplos de código usando a feature]
```

---

### 3. Submeter Código

#### 3.1 Setup Local

```bash
# Clone o repositório
git clone https://github.com/TheLuke013/CustomDimensionAPI.git

# Entre na pasta
cd CustomDimensionAPI

# Instale as dependências
npm install
```

#### 3.2 Crie uma Branch

```bash
# Crie uma branch descritiva
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-fix
```

#### 3.3 Faça suas Mudanças

- Mantenha as mudanças focadas em um único objetivo
- Siga o estilo de código existente
- Adicione comentários em código complexo
- Atualize a documentação se necessário

#### 3.4 Commits

```bash
# Commits com mensagens descritivas
git commit -m "Add: descrição clara da mudança"
git commit -m "Fix: descrição clara da correção"
git commit -m "Docs: descrição da mudança de documentação"
git commit -m "Refactor: descrição da refatoração"
```

**Convenção de mensagens:**
- `Add:` - Nova feature
- `Fix:` - Correção de bug
- `Docs:` - Mudança na documentação
- `Refactor:` - Mudança no código sem alterar comportamento
- `Test:` - Adição/mudança de testes

#### 3.5 Push e Pull Request

```bash
# Push para sua branch
git push origin feature/sua-feature
```

Vá ao GitHub e crie um Pull Request com:

- **Título claro**: O que sua PR faz?
- **Descrição detalhada**: Por que essas mudanças?
- **Relacione issues**: "Closes #123"
- **Checklist**: Verifique os itens antes de submeter

**Template de PR:**
```markdown
## Descrição
[Descreva o que esta PR faz]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Mudança em breaking
- [ ] Atualização de documentação

## Relacionado a Issues
Closes #[número da issue]

## Checklist
- [ ] Meu código segue o estilo do projeto
- [ ] Executei testes localmente
- [ ] Atualizei a documentação
- [ ] Minhas mudanças não criam novos warnings

## Screenshots (se aplicável)
[Compartilhe prints se for feature visual]
```

---

## Diretrizes de Código

### Estilo

```javascript
// ✅ BOM: Nomes descritivos
const customDimension = new CustomDimension(...);

// ❌ RUIM: Nomes genéricos
const dim = new CustomDimension(...);

// ✅ BOM: Comentários úteis
// Desabilitar mobs vanilla para manter ambiente limpo
dimension.canSpawnVanillaMobs = false;

// ❌ RUIM: Comentários óbvios
// Setar para false
dimension.canSpawnVanillaMobs = false;
```

### Estrutura de Classes

```javascript
// Ordem recomendada em classes:
export class MyClass {
  // Propriedades
  property1;
  property2;

  // Construtor
  constructor() {
    // ...
  }

  // Métodos públicos
  publicMethod() {
    // ...
  }

  // Métodos privados
  #privateMethod() {
    // ...
  }
}
```

### Exports

```javascript
// Use named exports para múltiplas exports
export class CustomDimension { }
export class TerrainMaterials { }
export const VerticalChunkSize = { };

// Use export default apenas para o principal
export default CustomDimensionManager;
```

---

## Diretrizes de Documentação

### Arquivos de Documentação

1. **README.md**: Visão geral e início rápido
2. **QUICKSTART.md**: Exemplos básicos prontos
3. **API_DOCUMENTATION.md**: Referência técnica completa
4. **EXAMPLES.md**: Exemplos práticos e padrões
5. **DOCUMENTATION_MAP.md**: Navegação

### Estrutura de Documentação

```markdown
# Título

## Seção 1

### Subseção 1.1

Texto explicativo com `código inline` quando apropriado.

#### Exemplo

\`\`\`javascript
// Código de exemplo
\`\`\`

**Resultado**: [O que o código faz]
```

---

## Diretrizes de Testes

Se você adicionar uma feature:

1. Teste localmente em Minecraft
2. Crie um exemplo em `example/`
3. Docummente em `API_DOCUMENTATION.md`
4. Adicione à lista de features em `README.md`

---

## Tipos de Contribuição

### Não-Código

- **Reportar bugs**: Invaluável para melhorar qualidade
- **Sugerir features**: Inspire novas funcionalidades
- **Melhorar documentação**: Tradução, esclarecimentos, exemplos
- **Exemplos**: Mostre usos criativos da API
- **Tutoriais**: Ajude outros a aprender

### Código

- **Bug fixes**: Corrija problemas existentes
- **Features**: Adicione novas funcionalidades
- **Refactoring**: Melhore código existente
- **Performance**: Otimize o que existe
- **Tests**: Adicione cobertura de testes

---

## Processo de Review

Quando você submeter um PR:

1. **Validação automática**: Testes e linters rodam automaticamente
2. **Review**: Um mantenedor revisará seu código
3. **Feedback**: Você pode receber sugestões
4. **Ajustes**: Faça os ajustes solicitados
5. **Merge**: Quando aprovado, será mergeado!

---

## Comunidade

- **GitHub Issues**: Para bugs e features
- **Discussions**: Para ideias e perguntas
- **YouTube**: Tutoriais em [TheLuke013](https://www.youtube.com/c/Lukinhas013)

---

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a ISC License.

---

## Perguntas?

- Abra uma issue em [GitHub](https://github.com/TheLuke013/CustomDimensionAPI)
- Comente em um PR se tiver dúvidas
- Envie DM no YouTube

---

## Agradecimentos

Obrigado por contribuir para melhorar a Custom Dimension API! 🙏

Seus esforços ajudam a comunidade Minecraft a criar coisas incríveis.

---

**Versão**: 1.0 | **Última atualização**: Abril 2026
