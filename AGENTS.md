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
  pages/                       # RAIZ do Expo Router. Só arquivos de rota aqui!
    _layout.tsx                # Stack raiz + QueryClientProvider (headerShown: false)
    index.tsx                  # "/"  Home/boas-vindas (fundo navy + logo)
    login/index.tsx            # "/login"
    signup/index.tsx           # "/signup"           — cadastro etapa 1 (dados)
    signup-password/index.tsx  # "/signup-password"  — cadastro etapa 2 (senha)
  features/                    # lógica de UI por página (FORA do diretório de rotas)
    <pagina>/
      sections/                # pedaços da página (ex.: login-form-section.tsx)
      <pagina>.controller.ts   # hook useXController: estado + validação + handlers
  services/                    # camada de dados por API (padrão repository)
    <api>/
      <api>.types.ts           # tipos de payload/retorno
      <api>.repository.ts      # interface + getXRepository() (escolhe mock/axios por env)
      <api>.axios.repository.ts# implementação real (usa @/lib/axios)
      <api>.mock.repository.ts # implementação mockada (dados simulados)
      <api>.service.ts         # hooks React Query (useXMutation / useXQuery)
  lib/
    env.ts                     # lê EXPO_PUBLIC_* (useMocks, apiUrl)
    axios.ts                   # instância única do axios (baseURL via env)
    query-client.ts            # QueryClient
  components/                  # componentes reutilizáveis (prefixo "brand-" p/ os da identidade)
    brand-button.tsx           # botão (variantes: orange | blue | outline)
    brand-field.tsx            # input com label
    screen-header.tsx          # cabeçalho com voltar + título
    bottom-bar.tsx             # barra inferior (câmera/início/telefone) — hoje só visual
  constants/
    brand.ts                   # Paletas light/dark + Radius — hex só aqui; UI usa useBrand()
  lib/
    brand-theme.tsx            # BrandThemeProvider + useBrand (preferência do sistema)
assets/images/                 # imagens (logo.png é a logo oficial)
```

## Arquitetura (siga ao criar novas telas)

Fluxo: **section → controller → service (React Query) → repository (mock | axios)**.

- **Página** (`src/pages/<pagina>/index.tsx`): é o componente core e a rota. Só compõe as
  sections e chama o controller uma vez, passando-o via prop `controller`. Sem regra de negócio.
- **Sections** (`src/features/<pagina>/sections/`): pedaços visuais da página. Recebem `controller`
  por prop e usam **named exports** (nunca ficam no diretório de rotas).
- **Controller** (`src/features/<pagina>/<pagina>.controller.ts`): hook `useXController()` que
  centraliza estado, validação e handlers, consumindo os hooks do service.
- **Service** (`src/services/<api>/<api>.service.ts`): expõe as chamadas da API como hooks do
  React Query; internamente resolve o repositório via `getXRepository()`.
- **Repository**: `getXRepository()` retorna o mock ou o axios conforme `env.useMocks`
  (`EXPO_PUBLIC_USE_MOCKS`). **Toda feature nasce com mock**, para não depender da API.

> O diretório de rotas (`src/pages`) NÃO aceita co-locar arquivos que não sejam rota — todo
> `.tsx` lá é tratado como rota. Sections/controllers/services ficam em `features/`, `services/`, `lib/`.
> A raiz customizada (`root: ./src/pages`) é frágil: se as rotas tipadas quebrarem, rode
> `npx expo start --clear` para regenerar `.expo/types/router.d.ts`.

## Convenções (siga sempre)

- **Cores e raios**: hex só em `@/constants/brand.ts` (paletas light/dark) e espelho CSS em `src/global.css`.
  Na UI use **`useBrand()`** de `@/lib/brand-theme` (e `Radius` de `@/constants/brand.ts`). Nunca escreva hex solto nas telas.
  - Preferência do sistema via `useColorScheme` (`BrandThemeProvider` no `_layout`).
  - `brand.navy` = fundo da marca (home); `brand.white` = fundo de tela; `brand.surface` = superfícies elevadas
  - `brand.orange`, `brand.cream`, `brand.blue` = destaques/CTA; `brand.onPrimary` = texto/ícone sobre azul/laranja
- **Imports**: use o alias `@/` (mapeado para `src/`) e `@/assets/` para assets.
- **Nomes de arquivo**: `kebab-case` para componentes e sections (`brand-button.tsx`, `login-form-section.tsx`); cada pasta em `src/pages/<pagina>/index.tsx` define a URL.
- **Idioma da UI**: textos visíveis em **português (pt-BR)**.
- **Componentes novos**: reaproveite `BrandButton`/`BrandField`/`ScreenHeader` antes de criar do zero.
- **Regra de negócio nas telas**: NÃO coloque regra na página. Estado/validação/handlers vão no controller.
- **Integração com API**: crie um service por API em `src/services/<api>/` com o par de repositórios
  (`*.axios.repository.ts` + `*.mock.repository.ts`) e o mock ligado por padrão (`EXPO_PUBLIC_USE_MOCKS=true`).

## Comandos

```bash
npm run check       # typecheck + lint — RODAR ANTES DE FINALIZAR QUALQUER TAREFA
npm run typecheck   # só tipos (tsc --noEmit)
npm run lint        # só ESLint
npm run lint:fix    # ESLint com correção automática
npm run format      # Biome: formata e escreve os arquivos
npm run format:check# Biome: só verifica a formatação
npm start           # inicia o Metro (Expo Go via QR Code)
```

### Variáveis de ambiente (`.env`, prefixo `EXPO_PUBLIC_`)

- `EXPO_PUBLIC_USE_MOCKS` — `true` usa os repositórios mockados (padrão); `false` usa a API real.
- `EXPO_PUBLIC_API_URL` — URL base da API (usada quando `EXPO_PUBLIC_USE_MOCKS=false`).

## Regras de trabalho para o agente

1. **Sempre rode `npm run check` antes de concluir** e só finalize com saída limpa (exit 0).
2. Neste ambiente (Windows), a instalação de pacotes exige contornar SSL:
   defina `NODE_OPTIONS=--use-system-ca` antes de `npm install` / `npx expo install`.
   No PowerShell: `$env:NODE_OPTIONS="--use-system-ca"`.
3. Prefira `npx expo install <pkg>` (garante versão compatível com o SDK) em vez de `npm install`.
4. Não introduza libs de UI/estilo novas sem necessidade — manter o padrão atual.
5. Respeite a arquitetura pages/features/services: nada de regra de negócio na página nem de
   co-locar não-rotas dentro de `src/pages`.
6. Feature nova sempre com repositório mock além do axios; o service escolhe por env.
7. Se as rotas tipadas quebrarem (`.expo/types/router.d.ts` com caminhos estranhos), rode
   `npx expo start --clear` para regenerar antes do `npm run check`.
