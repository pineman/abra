.DEFAULT_GOAL := all

LESS := $(wildcard style/*.less)
style/style.css: $(LESS)
	../node_modules/.bin/lessc --clean-css="--advanced" --autoprefix="last 2 versions" style/main.less $@

assets/socket.io.min.js: ../node_modules/socket.io-client/socket.io.js
	../node_modules/.bin/uglifyjs $^ > $@

clean:
	rm -rf style/style.css assets/socket.io.min.js serve

all: style/style.css assets/socket.io.min.js

server: all
	cp index.html index.html.tmp
	find * -name "*.js" -exec sed -i "/{}/d" index.html.tmp \;
	sed -i 's#</head>#  <script src="/abra.min.js"></script>\n</head>#g' index.html.tmp
	../node_modules/.bin/uglifyjs *.js > abra.min.js
	sed -i '1i (function () {' abra.min.js
	echo '})();' >> abra.min.js
	mkdir -p serve/{assets,style}
	mv index.html.tmp serve/index.html
	cp style/style.css serve/style
	cp assets/* serve/assets/
	mv abra.min.js serve/
