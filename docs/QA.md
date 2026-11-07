# Archived release 0.1 verification

Current release verification is documented in RELEASE_0_2.md. The following record describes the original first-release baseline.

# Verification record

Concept: `docs/design-concept.png`, generated with built-in Image Gen at 1536 × 1024. Implementation: `docs/implementation-desktop.png`, captured through the cloud browser screenshot API. Both were inspected with view_image in the same comparison pass.

Browser: built-in cloud browser through CUA, managed Sites preview. No Playwright fallback. Observed CSS viewport: 1363 × 936, title 40px, navigation 16px; document width equalled viewport width. Exact 1536px and mobile emulation were unavailable through the documented browser controls, so those dimensions are not visually verified. Responsive CSS provides the mobile navigation strip, two-column metrics, stacked detail panes and scrollable tables.

| Comparison | Result |
| --- | --- |
| Palette | White sidebar/panels, cool gray canvas, navy text and teal actions preserved. |
| Layout | Sidebar, breadcrumb, heading, four metrics, three-row table, activity and evidence panel preserved. |
| Copy | Primary heading, subtitle, navigation and CTA labels preserved. |
| Typography | Clear heading/body/control hierarchy; 40px heading and 16px navigation checked in the browser. |
| Icons | Consistent outline Lucide family with teal accents, matching the reference's meaning. |
| Container model | Subtle borders, restrained corners, table-led screen; no decorative imagery added. |
| Workflow additions | Mode switch and storage status deliberately added to distinguish sample records and real persistence. |

Above-the-fold copy diff: expected functional additions are My workspace / Sample workspace switch, persistence status, case count and ‘items’ instead of ‘files’ because notes and URLs are supported. Smaller type and spacing are intentional adaptations to the available viewport. No unintended content changes remain. The implementation was verified against the concept for the primary desktop layout; pixel-identical native-size and mobile fidelity are not claimed.

Material fixes: live case references made stable across filtering; sample dates kept stable across search; report moved from an about:blank popup to a same-origin printable report page for reliable review and linking.

Browser checks: initial local case creation and note persistence passed before the environment interruption; rebuilt case search, detail navigation, evidence/findings views, readiness checklist and printable sample report verified. The file-picker automation stalled, so original file upload/download was verified through isolated Worker integration tests rather than through that picker. Hosted sign-in remains platform-managed.

Tests: TypeScript and production build pass. Address filter covers 22 public/private examples. Worker acceptance tests cover unauthenticated rejection, origin guard, case/note/finding creation, evidence linkage, verification updates, unauthorized-check rejection, upload hash, exact original download, owner isolation, saved report snapshots, persisted reads, mocked DNS/HTTPS observations, cooldown and private-address rejection. Live DNS/HTTPS provider access is not established by these mocks.

Original brief for image generation: complete professional AIMNEX Digital Research Studio cases workspace, white sidebar, cool gray canvas, navy typography, deep teal accents, six navigation items, sample-labelled case metrics, a searchable three-case table, recent activity and a pale teal evidence panel. All UI text and controls implemented as real code.
