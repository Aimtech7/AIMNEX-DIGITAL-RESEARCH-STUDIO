# AIMNEX Digital Research Studio

A private cybersecurity research workspace for cases, traceable evidence, reviewed findings, remediation and client reporting. React/TypeScript + Vinext/Vite + Cloudflare Workers, D1 and R2. The deployed app uses platform-managed ChatGPT sign-in and stays owner-private unless its owner explicitly shares it.

## Implemented modules

| Module | Capability |
| --- | --- |
| Cases & evidence | Scope records; original uploads/downloads; SHA-256 verification; searchable notes and extracted text; timestamped activity. |
| Document desk | PDF text and scanned-page OCR, image OCR, DOCX/text/email/log extraction; review text before saving; separate original and derived evidence. |
| Scan imports | Nuclei JSON/JSONL, SARIF and Nmap XML; retain originals; deduplicate tool/target observations; suspected status pending review. |
| Website checks | Exact authorized hostname; public DNS validation; HTTPS HEAD and response headers; job history, cancellation and interrupted-job recovery. |
| Remediation | Assignees, deadlines, finding links, progress and evidence-required closure. |
| Intelligence | Evidence-backed observed relationships, labelled hypotheses, relationship map and chronological case history. |
| Monitoring | Manual monitoring, change/failure alerts, intervals, pause/resume; authenticated scheduler endpoint and supplied hourly GitHub runner. |
| AI assistant | Selected evidence, explicit send consent, Responses API integration, validated citation IDs, saved drafts, daily request/token quotas. |
| Team & portal | Owner/analyst/client authorization; assigned-case restrictions; selected client-safe published summaries; revocation. |
| Offline desk | Opt-in AES-GCM encrypted IndexedDB copy, PBKDF2 passphrase derivation, offline note drafts and idempotent online synchronization. |
| Learning lab | Three fictional guided exercises, answer explanations and saved scores. |
| Phone metadata | Format/country/numbering validation; metadata can be saved as evidence. No tracking or owner identification. |

## Local development

Node 24 is recommended (minimum 22.13). Python 3 is needed only for the optional local scanner wrapper and its unit tests.

```sh
npm ci
npm run build
```

Build prepares PDF and English OCR assets from locked npm dependencies under ignored `public/engines/`. It does not download language data from a third-party CDN at runtime. Apply each pending local database migration once, in order, using the built Worker config; then run `npm run dev`.

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_brainy_raza.sql
```

Repeat for pending `0001_material_lizard.sql` and `0002_brief_nightshade.sql`; do not replay migrations on an existing database. Hosted publication applies migrations separately. Local preview data never becomes production data.

## Validation

```sh
npx tsc --noEmit
npm run build
npm test
python -m unittest discover -s tests -p 'test_*.py'
```

Worker tests use isolated D1/R2 stores, synthetic users and mocked network/model responses. OCR, PDF and DOCX tests use actual engines with small synthetic fixtures. No test scans a real third-party system. CI runs the same checks on GitHub.

## Required activation

**AI:** Hosted generation remains disabled until secure OpenAI provider setup is complete. Use the OpenAI Developers integration for the credential flow, then store the key as a server runtime secret. Set `OPENAI_MODEL`, `AI_DAILY_LIMIT` and `AI_TOKEN_LIMIT` on the hosting runtime as desired. Defaults are `gpt-4.1-mini`, 20 requests/day and 100,000 reserved tokens/day. These are usage limits, not a promise about monetary cost. Failed requests retain their conservative reservation. Keys are never exposed by the app or stored in Git.

**Scheduled monitoring:** Open Monitoring as owner and create a scheduler token. Save it as repository secret `MONITOR_RUN_SECRET`; set repository variable `STUDIO_URL` to the deployed origin. For the private hosted Site, also configure `SITES_SERVICE_TOKEN` using the platform-supported service credential. Never make the app public to run the scheduler. The supplied workflow runs hourly when configured, processes up to ten due monitors per invocation and prints counts only. Without configuration it sends no requests. Creating a token does not prove a schedule ran. Native Worker hosts can wire their own Cron Trigger to the exported `scheduled` handler.

**Team/client access:** A saved app membership does not bypass the hosting gate. Explicitly share the private Site with the intended visitors using its platform access controls. Send the portal URL through your usual channel; this application sends no emails. Clients can read only published summaries for assigned cases. Originals, internal evidence and finding detail are redacted from portal API responses.

**Offline:** Save an encrypted copy with a passphrase of at least ten characters, and open `/offline.html` once while online. Only the offline desk's static shell is cached. Authenticated API responses and unencrypted case records are never placed in the service-worker cache. Keep the passphrase safe: the application cannot recover it. Original attachment bytes are not included in the offline copy.

## Bounded local scanner

`tools/local_scanner.py` optionally runs an explicitly authorized Nmap assessment on the operator's computer, using an exact scope allowlist, bounded ports/timeouts and no shell interpolation. It is not a remote autonomous agent. Start with the supplied localhost lab scope:

```sh
python tools/local_scanner.py --scope tools/scope.example.json --target 127.0.0.1 --confirm-authorization --dry-run
```

Inspect the command, remove `--dry-run` only for your authorized target, then import the generated XML through Research tools. Nmap must already be installed from its official source.

## Limits and data handling

This release does not provide exploit automation, precise phone location, carrier/owner verification, TLS certificate expiry monitoring or AI video generation. OCR is English; tables/handwriting require careful human review. Up to 10 MB per file, 20 PDF pages per extraction, 16 MP per image, 50,000 saved extracted characters and 100 scan results per import. Split larger inputs explicitly. AI drafts never automatically become confirmed findings or execute tools. Citation IDs are validated; factual correctness still requires review. The application activity log is not a tamper-proof forensic chain of custody.

The repository contains application source, migration history, locked dependencies, fixtures and workflows. Secrets, uploads, databases, generated engines, build output and local runtime state are excluded. Runtime data remains separate from GitHub.
