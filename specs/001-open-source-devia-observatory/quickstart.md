# Quickstart: Validate the DevIA Observatory Repositioning

## 1. Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Validate the product story

- Confirm the first viewport says "Observatoire DevIA" or equivalent.
- Confirm there is no primary "commencer la formation" CTA.
- Confirm the interface shows categories, resource counts and source links.

## 3. Validate filtering

- Search for `context`.
- Select a category such as "Context engineering".
- Confirm visible cards update without a page reload.

## 4. Validate dossiers

- Open a related internal dossier from a category.
- Confirm the reader still works and sidebar labels use "Dossiers" rather than
  "Modules".

## 5. Validate open source docs

- Read `README.md`.
- Confirm it explains setup, curation model, Spec Kit workflow and license.
- Confirm `LICENSE` exists.

## 6. Validate build

```bash
npm run typecheck
npm run build
```
