# Como vincular o Front-end ao Back-end (Spring Boot)

Este guia explica, passo a passo, como conectar este front-end (React + Vite + Axios) ao back-end em **Java Spring Boot** que ainda será implementado. Ele é baseado na camada de API já construída em:

- [`src/services/api.js`](src/services/api.js) — instância do Axios
- [`src/services/exercicioService.js`](src/services/exercicioService.js) — chamadas de cadastro de exercício e listagem dos enums
- [`src/components/LibraryComponents/LibraryHead.jsx`](src/components/LibraryComponents/LibraryHead.jsx) — formulário que consome esse serviço

---

## 1. Como o front-end descobre a porta do back-end

A URL do back-end **não está fixa no código**. Ela vem de uma variável de ambiente lida pelo Vite:

```js
// src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  ...
});
```

Essa variável é definida em um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`).

### Passo 1 — Criar o arquivo `.env`

Já existe um `.env.example` versionado no repositório, servindo de modelo. Copie-o:

```bash
cp .env.example .env
```

*(No Windows/PowerShell: `Copy-Item .env.example .env`)*

### Passo 2 — Apontar para a porta real do back-end

Abra o `.env` e ajuste a porta conforme o Spring Boot estiver configurado (padrão do Spring Boot é `8080`, mas pode variar se houver `server.port` customizado em `application.properties`/`application.yml`):

```
VITE_API_URL=http://localhost:8080/api
```

> Se o back-end usa outro contexto (ex.: sem `/api`, ou `/v1`), ajuste aqui — **não precisa mexer em nenhum outro arquivo do front**, pois todo o resto usa caminhos relativos a essa base (`/exercicios/...`).

### Passo 3 — Reiniciar o Vite

O Vite só lê o `.env` na inicialização do servidor de dev. Depois de criar/editar o arquivo:

```bash
npm run dev
```

Se o servidor já estava rodando, pare (`Ctrl+C`) e rode de novo — ou aguarde o restart automático (o Vite detecta mudança em `.env` e reinicia sozinho, mas vale confirmar no terminal).

> ⚠️ `.env` está no `.gitignore` — cada pessoa/ambiente mantém o seu próprio, apontando para sua porta local. Só o `.env.example` é versionado.

### Passo 4 — Mock da área de Progresso

A Biblioteca de Exercícios já bate 100% na API real. O único mock restante é o de **métricas** (página de Progresso), ligado por `VITE_METRICAS_MOCK=true` no `.env`, porque os endpoints `/api/metricas/*` ainda não existem no back. Quando subirem, troque para `false` e remova `src/services/mocks/metricasMock.js` junto com os desvios `if (usarMock)` do `metricasService.js`.

---

## 2. Endpoints que o back-end precisa expor

O front já está pronto para consumir estes três endpoints. Enquanto eles não existirem, as chamadas vão falhar com erro de conexão — isso é esperado até o back-end subir.

### `GET {VITE_API_URL}/exercicios/grupos-musculares`

Alimenta o `<select>` de Grupo Muscular. Formato esperado (array de objetos):

```json
[
  { "codigo": "PEITO", "descricao": "Peito" },
  { "codigo": "COSTAS", "descricao": "Costas" }
]
```

### `GET {VITE_API_URL}/exercicios/niveis`

Alimenta o `<select>` de Nível:

```json
[
  { "codigo": "INICIANTE", "descricao": "Iniciante" },
  { "codigo": "INTERMEDIARIO", "descricao": "Intermediário" },
  { "codigo": "AVANCADO", "descricao": "Avançado" }
]
```

> `codigo` deve corresponder ao `name()` do enum Java (ex.: `GrupoMuscular.PEITO`). É esse valor que o front envia de volta no cadastro — a `descricao` é só o rótulo exibido na tela.

### `POST {VITE_API_URL}/exercicios`

Cadastra um novo exercício. Corpo enviado pelo front (JSON):

```json
{
  "nome": "Supino Reto",
  "caracteristicas": "...",
  "grupoMuscular": "PEITO",
  "nivel": "INICIANTE",
  "descricaoExecucao": "...",
  "errosComuns": "...",
  "aquecimentoRecomendado": "...",
  "equipamento": "...",
  "gifUrl": "https://..."
}
```

Observações importantes para quem for implementar o back:
- `grupoMuscular` e `nivel` chegam como **string** (o código do enum) — o Spring converte automaticamente para o enum Java se o nome da constante bater exatamente.
- Não existe campo de data de criação no payload — isso deve ser gerado pelo back (ex.: `@CreationTimestamp`), não pelo cliente.
- Retorne um corpo de erro no formato `{ "message": "..." }` em respostas de erro (4xx/5xx) — o front já está preparado para exibir esse `message` ao usuário (`api.js`, interceptor de response).

---

## 3. CORS — passo obrigatório no back-end

Como o front roda em `http://localhost:5173` (Vite) e o back em outra porta (ex.: `8080`), o navegador vai bloquear as requisições por CORS até o Spring Boot liberar essa origem explicitamente.

Exemplo mínimo de configuração no Spring Boot:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

Sem isso, mesmo com a porta certa configurada no `.env`, as chamadas vão falhar no navegador com um erro de CORS (visível no console/Network do DevTools).

---

## 4. Como testar a conexão

1. Suba o back-end Spring Boot na porta configurada.
2. Confirme que `.env` aponta para essa porta e reinicie `npm run dev`.
3. Acesse `/library` no front e clique em **Adicionar exercicio**.
4. Os selects de Grupo Muscular e Nível devem sair de "Carregando..." e mostrar as opções vindas do back.
5. Preencha o formulário e clique em **Cadastrar** — confira no DevTools (aba Network) a requisição `POST /exercicios` e a resposta do back.

---

## 5. Solução de problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `ERR_CONNECTION_REFUSED` no console | Back-end não está rodando, ou porta errada no `.env` | Suba o back-end / confira a porta em `application.properties` |
| Erro de CORS no console/Network | Back-end não libera a origem do front | Configurar `CorsConfig` (seção 3) |
| Selects ficam presos em "Carregando..." | Requisição travando (timeout) ou resposta em formato inesperado | Confirmar que o endpoint responde em até 10s (timeout do Axios) e retorna o formato `[{ "codigo", "descricao" }]` |
| Mensagem genérica "Não foi possível concluir a operação" | Resposta de erro do back sem o campo `message` | Padronizar corpo de erro como `{ "message": "..." }` |
| Grupo/Nível não bate com o esperado no back | `codigo` enviado pelo front não corresponde ao `name()` do enum Java | Garantir que os `codigo` retornados pelo GET de enums sejam exatamente iguais aos nomes das constantes Java |

---

## 6. Resumo rápido

1. `cp .env.example .env`
2. Editar `VITE_API_URL` no `.env` com a porta real do back-end
3. Reiniciar `npm run dev`
4. Configurar CORS no Spring Boot para `http://localhost:5173`
5. Implementar os 3 endpoints listados na seção 2
6. Testar pelo modal "Adicionar exercicio"
