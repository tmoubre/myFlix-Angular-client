# myFlix Angular Client (Commented)

This package includes TypeDoc-friendly comments across the Angular client and a README with setup/documentation steps.

## Install
```bash
npm install
```

## Run
```bash
ng serve
```

## Generate Documentation
```bash
npm i -D typedoc
npx typedoc --out docs src/app
```
Open `docs/index.html` in your browser.

> TypeDoc reads comments starting with `/** ... */`.

## Notes
- Only source files are included here (no node_modules).
- Replace files in your project with these to add comments.
