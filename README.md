[![CI](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/ci.yml) [![CodeQL](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/github-code-scanning/codeql)


# KMHFR Frontend

This is the frontend application for KMHFL with new features (GIS, Dynamic Reports). Phase 1 is to have it as a read-only data consumption app. Phase 2 and beyond is to add CRUD features.

## Tech stack

- Next.js
- Tailwind CSS

## API

Currently, this uses the test API available through [api.kmhfr.health.go.ke](https://api.kmhfr.health.go.ke).



## Setting up local instance

- Clone this repository ```git clone https://github.com/uonafya/kmhfr```
- cd into the folder ```cd kmhfr```
- Make a copy of the ```.env``` file and add your environment variables as detailed ```cp .env.local.example .env.local && nano .env.local```
- Install dependencies ```npm install``` or ```yarn``` or ```pnpm install```
- For local development, run ```npm run dev``` or ```yarn dev``` or ```pnpm dev```


