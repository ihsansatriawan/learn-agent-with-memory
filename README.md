# learn-agent-memory

An [Anvia](https://github.com/anvia-hq/anvia) agent with Prisma-backed persistent memory
(with automatic summary compaction) and a small set of domain tools, served through
`@anvia/studio`'s local UI/HTTP runtime.

## What it does

- **Assistant agent** (`src/agents.ts`) — a single `Agent` (id `assistant`) built from an
  OpenAI-compatible chat model, with pluggable tools passed in at construction time.
- **Persistent memory** — conversation history is stored via `PrismaMemoryStore`
  (`src/memory.ts`) against the tables defined in `prisma/contract.prisma`
  (`AgentMemorySession`, `AgentMemoryMessage`, `AgentMemoryError`). Memory is saved every turn
  and automatically compacted into a running summary once a session passes ~200 tokens
  (`createSummaryMemoryCompactor` in `src/agents.ts`).
- **IPL (iuran/payment) tools** (`src/tools/ipl-tools.ts`), currently wired into the agent
  in `src/index.ts`:
  - `get-payment-status` — look up payment status for a house number (`noRumah`) and month.
  - `submit-payment` — submit a payment for a house number and month.
  - `summarize-ipl` — summarize outstanding/paid payments for a house number.

  These currently run against `mockIplService` (`src/services/mock-ipl-services.ts`), which
  returns canned data. `src/services/ipl-services.ts` is a stub for the real implementation
  (hitting an actual API/database).
- **Order tool** (`src/tools/order-tools.ts`) — `order`, which queries order status by
  `orderId`. Backed by `orderService` / `mockOrderService`
  (`src/services/order-services.ts`, `src/services/mock-order-services.ts`). Scaffolded but
  **not yet registered** on the agent in `src/index.ts`.
- **Studio runtime** — `new Studio([agent]).start()` serves the agent locally with a
  browser UI and HTTP API for chatting, inspecting sessions/traces/tool calls, and viewing
  memory/compaction state.

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `OPENAI_API_KEY` — an OpenAI-compatible API key (e.g. an OpenRouter key).
   - `OPENAI_BASE_URL` — optional; base URL of an OpenAI-compatible endpoint (defaults to
     the official OpenAI API). Example for OpenRouter: `https://openrouter.ai/api/v1`.
   - `DATABASE_URL` — PostgreSQL connection string (>= 15) used for agent memory storage.
2. Apply the memory contract to the database: `prisma migrate` / `prisma db push` against
   `prisma/contract.prisma` (see `prisma.config.ts`), or your usual Prisma workflow.
3. `pnpm run dev` — runs `src/index.ts`, which registers the IPL tools on the agent and
   starts Studio.

## Try it

After `pnpm run dev`, open the Studio UI (URL printed in the terminal) and chat with the
`assistant` agent. Since the IPL tools currently run on `mockIplService`, any `noRumah`/`month`
works — the mock always returns the same canned data. Example scenarios:

- **Check payment status**
  > "Cek status pembayaran IPL untuk rumah A12 bulan Agustus"

  Calls `get-payment-status`; the mock always reports status `pending`, awaiting
  verification by the pengurus.

- **Submit a payment**
  > "Saya sudah bayar IPL rumah A12 untuk bulan Agustus, tolong catat"

  Calls `submit-payment`; the mock reports status `submitted`, awaiting confirmation.

- **Summarize a household's IPL**
  > "Ringkas tagihan IPL untuk rumah A12"

  Calls `summarize-ipl`; the mock returns a fixed total (Rp1.500.000) with 3 months
  outstanding.

- **Multi-turn / memory check**
  > 1. "Nama saya Budi, rumah saya A12."
  > 2. "Ringkas tagihan IPL saya." (agent should recall `noRumah` A12 from turn 1 without
  >    being told again, thanks to `PrismaMemoryStore`)
  > 3. Continue chatting past ~200 tokens in the same session to see the conversation get
  >    summarized by `createSummaryMemoryCompactor` instead of growing unbounded — visible
  >    in Studio's session/memory inspector.


## Available scripts

- `pnpm run dev` — run `src/index.ts` (starts the agent + Studio)
- `pnpm run contract:emit` — emit Prisma contract artifacts after changing
  `prisma/contract.prisma`

## Project layout

- `src/index.ts` — entry point: builds tools, creates the agent, starts Studio.
- `src/agents.ts` — `createAgent()` factory (model, instructions, memory, compaction).
- `src/models.ts` — OpenAI-compatible model client/config.
- `src/prompts.ts` — base system instructions.
- `src/memory.ts` — Prisma-backed memory store.
- `src/tools/` — tool definitions (`ipl-tools.ts`, `order-tools.ts`).
- `src/services/` — business logic / data access behind each tool, with mock (`mock-*`) and
  real (stubbed) implementations.
- `prisma/contract.prisma`, `prisma.config.ts`, `prisma/db.ts` — Prisma Next database setup
  for the memory store.

Node.js 24 LTS or newer is expected.
