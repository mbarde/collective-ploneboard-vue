#!/bin/bash
npm cache clean --force
rm -rf node_modules/
rm package-lock.json
npm install
rm -rf dist/
npm run build
