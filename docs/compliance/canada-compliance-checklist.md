# Canada Compliance Checklist (MVP to Production)

## Scope
Operational baseline for a Canadian B2C personal-finance SaaS before production launch.

## Minimum Controls Implemented in Code
- Public legal pages:
  - `/privacy`
  - `/terms`
  - `/data-retention`
- DSR API flow:
  - `POST /api/dsr` to open access/correction/deletion requests
  - `GET /api/dsr` to list request history for authenticated user
- Sensitive data access audit trail:
  - `access_audit_logs` table
  - audit writes for dashboard access and critical financial mutations

## Required Process Controls (Non-Code)
- Appoint privacy and security owners.
- Define legal response SLAs for DSR requests.
- Define retention/deletion schedule for financial and audit records.
- Establish incident response and breach notification process.
- Keep evidence for policy updates, approvals, and access reviews.

## Legal/Regulatory Review Items
- Validate PIPEDA applicability and obligations.
- Validate Quebec Law 25 obligations if serving Quebec residents.
- Validate FINTRAC applicability based on actual business model and product scope.

## Official References
- PIPEDA (Office of the Privacy Commissioner of Canada):\n  https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/
- FINTRAC compliance requirements:\n  https://fintrac-canafe.canada.ca/guidance-directives/compliance-conformite/req-eng
- Quebec Law 25 overview (CAI Quebec):\n  https://www.cai.gouv.qc.ca/loi-25/
