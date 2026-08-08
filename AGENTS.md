# EncontrameApp — Guia para agentes

> Fonte única de verdade para IA (Cursor lê `AGENTS.md`; Claude lê `CLAUDE.md`, que importa este arquivo via `@AGENTS.md`).
> Leia este arquivo inteiro **antes de qualquer implementação**.

## Sobre o app

Aplicativo para **encontrar pessoas desaparecidas**. Funcionalidades:

- Chat com IA (a IA roda no backend; o app só troca mensagens)
- Localização / GPS (mapas, avistamentos)
- Câmeras de segurança (fase futura)

O backend/API já existe e é mantido separadamente — este repositório é apenas o **frontend mobile**.

## Stack

- **Expo (SDK 57)** + **React Native** + **TypeScript**
- **Expo Router** (navegação baseada em arquivos, raiz movida para `src/pages` via plugin `["expo-router", { "root": "./src/pages" }]` em `app.json`)
- **@tanstack/react-query** (estado assíncrono / dados da API)
- **axios** (cliente HTTP dos repositórios)
- **@expo/vector-icons** (ícones, use `MaterialCommunityIcons`)
- Estilo com `StyleSheet` do React Native (sem lib de UI externa)
- **Biome** apenas como formatador (o lint continua no ESLint)

> Expo muda muito entre versões. Consulte a doc exata em https://docs.expo.dev/versions/v57.0.0/ antes de usar APIs do Expo.

## Estrutura de pastas

```
src/
  app/                 # rotas (Expo Router). Cada arquivo = uma tela
    _layout.tsx        # Stack raiz (headerShown: false)
    index.tsx          # Home/boas-vindas (fundo navy + logo)
    login.tsx          # Entrar
    signup.tsx         # Criar conta — etapa 1 (dados pessoais)
    signup-password.tsx# Criar conta — etapa 2 (senha)
  components/          # componentes reutilizáveis (prefixo "brand-" p/ os da identidade)
    brand-button.tsx   # botão (variantes: orange | blue | outline)
    brand-field.tsx    # input com label
    screen-header.tsx  # cabeçalho com voltar + título
    bottom-bar.tsx     # barra inferior (câmera/início/telefone) — hoje só visual
  constants/
    brand.ts           # CORES e RAIOS da marca — fonte única de estilo
assets/images/         # imagens (logo.png é a logo oficial)
```

## Convenções (siga sempre)

- **Cores e raios**: use SEMPRE `Brand` e `Radius` de `@/constants/brand.ts`. Nunca escreva hex solto nas telas.
  - `Brand.navy` = `#0B2442` (fundo, igual ao fundo da logo)
  - `Brand.orange`, `Brand.cream`, `Brand.blue` = destaques/CTA
- **Imports**: use o alias `@/` (mapeado para `src/`) e `@/assets/` para assets.
- **Nomes de arquivo**: `kebab-case` para componentes (`brand-button.tsx`); nomes de rota em `src/app` definem a URL.
- **Idioma da UI**: textos visíveis em **português (pt-BR)**.
- **Componentes novos**: reaproveite `BrandButton`/`BrandField`/`ScreenHeader` antes de criar do zero.
- **Integração com API**: pontos de integração estão marcados com `// TODO:` nas telas de login/cadastro.

## Comandos

```bash
npm run check       # typecheck + lint — RODAR ANTES DE FINALIZAR QUALQUER TAREFA
npm run typecheck   # só tipos (tsc --noEmit)
npm run lint        # só ESLint
npm run lint:fix    # ESLint com correção automática
npm start           # inicia o Metro (Expo Go via QR Code)
```

## Regras de trabalho para o agente

1. **Sempre rode `npm run check` antes de concluir** e só finalize com saída limpa (exit 0).
2. Neste ambiente (Windows), a instalação de pacotes exige contornar SSL:
   defina `NODE_OPTIONS=--use-system-ca` antes de `npm install` / `npx expo install`.
   No PowerShell: `$env:NODE_OPTIONS="--use-system-ca"`.
3. Prefira `npx expo install <pkg>` (garante versão compatível com o SDK) em vez de `npm install`.
4. Não introduza libs de UI/estilo novas sem necessidade — manter o padrão atual.
