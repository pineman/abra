.DEFAULT_GOAL := all

LESS := $(wildcard style/*.less)
style/style.css: $(LESS)
	../node_modules/.bin/lessc --clean-css="--advanced" --autoprefix="last 2 versions" style/main.less $@

assets/socket.io.min.js: ../node_modules/socket.io-client/socket.io.js
	../node_modules/.bin/uglifyjs $^ > $@

clean:
	rm -f style/style.css assets/socket.io.min.js

all: style/style.css assets/socket.io.min.js

server: all
	cp index.html index.html.bak
	find * -name "*.js" -exec sed -i "/{}/d" index.html \;
	sed -i 's#</head>#  <script src="/abra.min.js"></script>\n</head>#g' index.html
	../node_modules/.bin/uglifyjs *.js > abra.min.js
	sed -i '1i (function () {' abra.min.js
	echo '})();' >> abra.min.js
