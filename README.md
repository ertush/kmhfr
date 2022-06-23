# KMHFL3 Frontend

This is the frontend application for KMHFL with new features (GIS, Dynamic Reports). Phase 1 is to have it as a read-only data consumption app. Phase 2 and beyond is to add CRUD features.

## Tech stack
- Next.js
- Tailwind CSS

## API

Currently, this uses the test API available through [api.kmhfltest.health.go.ke](https://api.kmhfltest.health.go.ke). 

## Preview

An on-premise test server is needed. Currently, you can preview the example live on [kmhfl3.vercel.app](https://kmhfl3.vercel.app):

## How to use

- Clone this repository ```git clone https://github.com/benzerbett/kmhfl-mbele-ui mfl3``` 
- cd into the folder ```cd mfl3```
- Make a copy of the ```.env``` file and add your environment variables as detailed ```cp .env.local.example .env.local && nano .env.local```
- If you are using npm, run ```rm yarn.lock```
- Install dependencies ```npm install``` or ```yarn```
- For local development, run ```npm run dev``` or ```yarn dev```
