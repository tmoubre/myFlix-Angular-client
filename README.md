# myFlix Angular Client

A modern Angular front-end for **myFlix** — browse movies, open details (synopsis / genre / director), manage favorites, and update your profile. The app authenticates with JWT against the myFlix API.

---

## Features

- **Authentication**: Register, login; token persisted in `localStorage`
- **Movies**: List/grid of titles with dialogs for **Synopsis**, **Genre**, **Director**
- **Favorites**: Add/remove a movie from favorites; changes reflected in Profile
- **Profile**: View/update profile; delete account
- **Routing**: Protected routes via `AuthGuard`
- **UI**: Angular Material, responsive layout
- **Docs**: TypeDoc output in `/docs`

---

## Tech Stack

- **Framework**: Angular 20
- **UI**: Angular Material
- **HTTP**: Angular `HttpClient` (with auth interceptor)
- **Streams**: RxJS
- **Docs**: TypeDoc
- **Tooling**: Angular CLI, Prettier (HTML parser set to `angular`)
- **(Optional)** SSR: Angular SSR packages present; an SSR serve script is included

---

## Project Structure (high-level)

src/
app/
core/ # guards, interceptors, shared services
features/
movies/ # movie list, cards, dialogs
profile/ # profile page (favorites, user info)
welcome/ # login/register landing or dialogs
register/ # registration page (if not dialog)
navigation/ # top navigation bar
models/ # TS interfaces for Movie/User/etc.
fetch-api-data.service.ts # API service (base URL lives here)
main.ts
main.server.ts # SSR entry (optional)

yaml
Copy
Edit

---

## Prerequisites

- **Node.js**: v18+ (v20+ recommended)
- **Angular CLI**: installed locally via devDependencies (or globally with `npm i -g @angular/cli`)
- **myFlix API**: running locally at `http://localhost:8080`  
  > If your API runs elsewhere, update the base URL in `src/app/fetch-api-data.service.ts` (or your environment config if you use one).

---

## Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Start the dev server
npm start

# App: http://localhost:4200
# API (expected): http://localhost:8080
If you change the API host/port, ensure CORS is configured on the API and update the Angular service/environment.

NPM Scripts
bash
Copy
Edit
npm start                       # ng serve (dev)
npm run build                   # production build to ./dist
npm run watch                   # dev build watcher
npm test                        # unit tests (Karma/Jasmine)
npm run serve:ssr:myFlix-Angular-client  # SSR (if configured)
npm run docs                    # generate TypeDoc docs (see below)
The SSR script name mirrors your current package.json. If you rename the app, adjust accordingly.

Documentation (TypeDoc)
Install once (if not already present)
bash
Copy
Edit
npm i -D typedoc
Script (recommended)
Ensure your package.json has:

json
Copy
Edit
{
  "scripts": {
    "docs": "typedoc --out docs --entryPointStrategy expand src/app --exclude \"**/*.spec.ts\" --tsconfig tsconfig.app.json"
  }
}
Generate docs
bash
Copy
Edit
npm run docs
# Open ./docs/index.html
Notes

If TypeDoc warns about @file, replace it with @packageDocumentation at the top of TS files.

For external Angular API links in comments, use full URLs, e.g.:
{@link https://angular.dev/api/forms/AbstractControl#updateValueAndValidity | updateValueAndValidity}

Optional config file (typedoc.json)

json
Copy
Edit
{
  "entryPointStrategy": "expand",
  "entryPoints": ["src/app"],
  "tsconfig": "tsconfig.app.json",
  "exclude": ["**/*.spec.ts", "**/*.server.ts"]
}
Then run:

bash
Copy
Edit
npm run docs -- --options typedoc.json
Build & Deployment
bash
Copy
Edit
npm run build
# Output: ./dist/myFlix-Angular-client
You can serve the built files with any static host or integrate into your deployment pipeline. If you plan to use SSR, verify your SSR setup or run ng add @angular/ssr to scaffold any missing pieces.

Code Style & Commenting
Prettier is configured with the Angular HTML parser:

json
Copy
Edit
"prettier": {
  "overrides": [
    { "files": "*.html", "options": { "parser": "angular" } }
  ]
}
Commenting guidelines (per brief):

Use single-line // for short explanations

Use block TSDoc /** ... */ for components, classes, and public methods

Keep inline comments minimal and only when truly necessary

Remove outdated/unnecessary comments

Key Dependencies (from package.json)
Runtime

@angular/animations: ^20.1.x

@angular/cdk: ^20.1.x

@angular/common: ^20.1.x

@angular/compiler: ^20.1.x

@angular/core: ^20.1.x

@angular/forms: ^20.1.x

@angular/material: ^20.1.x

@angular/platform-browser: ^20.1.x

@angular/platform-server: ^20.1.x

@angular/router: ^20.1.x

@angular/ssr: ^20.1.x

express: ^5.1.0 (used by SSR server script)

rxjs: ~7.8.0

zone.js: ~0.15.0

Dev

@angular/cli: ^20.1.x

@angular/build: ^20.1.x

@angular/compiler-cli: ^20.1.x

typescript: ~5.8.x

typedoc: ^0.28.10

testing libs: jasmine-core, karma & reporters/launchers

types: @types/node, @types/express, @types/jasmine

(Your exact versions may vary slightly; see package.json.)

Security Notes
For simplicity, the token is stored in localStorage. For higher security, consider HttpOnly cookies and CSRF protection on the API.

Troubleshooting
Docs script not found
Add the docs script to package.json and install typedoc as shown above.

TypeDoc “unknown block tag @file”
Replace with @packageDocumentation.

Unresolved @link to Angular APIs
Use full URLs (see example above).

401 / CORS issues
Ensure the API allows your Angular origin and your token is present.

Author / Contact
Troy
Email: oubre1@att.net
Portfolio/LinkedIn: www.linkedin.com/in/troy-oubre-32170a32

License

MIT (or your preferred license). If open source, include a LICENSE file.


Want me to tailor the **Dependencies** section to the exact versions in your `package.json` right now? If you paste that file, I’ll lock the numbers in.
