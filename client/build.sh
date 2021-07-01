#!/bin/bash
set -euxo pipefail

rm -rf bundle
mkdir bundle
cp assets/* bundle
npx html-minifier \
	--remove-comments --sort-attributes --sort-class-name \
	--remove-redundant-attributes --collapse-whitespace --conservative-collapse \
	index.html -o bundle/index.html
npx lessc \
	--verbose --source-map --source-map-include-source --clean-css \
	less/main.less bundle/style.min.css
npx browserify -d -o bundle/abra.js js/main.js