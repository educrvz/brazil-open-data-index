# Contributing

Thanks for improving the Brazil Open Data Index.

## Add or update a source

Edit `data/sources.csv` and keep one source per row.

Required minimum fields:

- `Name`
- `Agency`
- `Level`
- `Domain`
- `URL`
- `Access Method`
- `Formats`
- `What You Can Get`
- `Auth Required`
- `Limitations`
- `Last Verified`

Use ISO dates for `Last Verified`, for example `2026-07-01`.

## Review standard

Before opening a pull request:

- Confirm the source URL works.
- Prefer official primary sources.
- Mark mirrors, paid access, restricted access, or login requirements clearly.
- Do not add personal data, credentials, scraped private data, or non-public datasets.
- Add the practical limitation a user should know before relying on the data.

## Local check

```bash
npm install
npm run build
```
