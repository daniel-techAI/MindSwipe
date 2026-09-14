# Security policy

MindSwipe does not yet publish supported release branches.

Report suspected vulnerabilities or privacy problems privately through GitHub's **Security > Report a vulnerability** flow. Do not include credentials, personal data, precise locations, trip notes, or exploit details in a public issue.

Helpful reports include the affected version/commit, reproducible steps, impact, and a proposed mitigation. If committed credentials are found, identify the file and commit without repeating the value.

## Current trust boundary

- Local state only; no account, backend, analytics, ads, payment, cloud sync, AI, or GPS.
- External navigation/source requests happen only after user action.
- Android permissions are internet, notifications, and schedule exact alarm.
- Android backup and cleartext traffic are disabled.
- State reads are normalized; corrupt state is backed up locally and replaced with a valid default.
- URLs are built with structured URL APIs and external links use `noopener` behavior through `rel="noreferrer"`.
- No unsafe HTML rendering is used.

Treat unexpected network transmission, hidden telemetry, source-link injection, path traversal in bundled assets, cross-user state exposure, permission misuse, route stop loss, persistence after reset, or committed signing secrets as security/privacy defects.

## Release secrets

Never commit keystores, signing passwords, service-account keys, API keys, `local.properties`, `.env` files, or Play credentials. Release signing must use protected local/CI secrets with least privilege.

## Boundary-change rule

Accounts, cloud sync, analytics, ads, payments, crash reporting, remote packs, or location require a new threat model, data-flow documentation, dependency review, retention/deletion behavior, privacy/store updates, and security tests before release.
