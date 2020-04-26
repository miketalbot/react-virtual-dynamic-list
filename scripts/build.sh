#!/usr/bin/env sh

rm -rf dist ./al-react-ioc-widgets.tar.gz
NODE_ENV=production babel src/component --ignore "__tests__","**/*.spec.js","**/*.test.js","__snapshots__" --out-dir dist
#tar -czf ../al-react-ioc-widgets.tar.gz . && mv ../al-react-ioc-widgets.tar.gz .
