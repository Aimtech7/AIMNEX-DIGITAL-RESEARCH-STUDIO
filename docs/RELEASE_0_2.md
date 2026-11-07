# Release 0.2 verification

The existing white/cool-gray/teal design is preserved. Sidebar entries expose new workflow modules; forms, tables, badges and type scale follow the established component system. PDF/OCR engines and advanced tools are lazy-loaded.

Backend acceptance coverage: workspace isolation; owner/analyst/client denial; client report redaction and revocation; original file integrity; import deduplication; proof-required relationships and remediation closure; offline note idempotency; model consent, known-citation enforcement and daily quota; monitoring baseline changes and hashed scheduler credentials. The model and remote website responses in these tests are mocked.

Real engine tests cover PDF text, DOCX text and English OCR. Encrypted IndexedDB tests cover roundtrip, wrong-password denial, ciphertext opacity, draft retention and removal. Scanner wrapper tests cover exact scope and bounded argument construction without executing a scan.

Browser checks target navigation into Research tools, scan import controls, learning exercise selection and new module rendering. Local preview is isolated from hosted identities; live multi-user sign-in, paid AI, external scheduler activation and mobile emulation remain distinct acceptance steps. No API key, invitation, public sharing grant or active third-party scan is created by the verification suite.

Deferred capabilities: certificate expiry monitoring and video generation need separate implementation/compute. Automated live Nuclei/NeuroSploit execution is not provided; their saved results are imported for review. Offline operation covers the encrypted reading/note-drafting desk, not online-only checks or original file downloads.
