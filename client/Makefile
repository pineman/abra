.DEFAULT_GOAL := all

LESS := $(wildcard ../style/*.less)
style/style.css: $(LESS)
	../node_modules/.bin/lessc --clean-css="--advanced" --autoprefix="last 2 versions" style/main.less $@

assets/socket.io.min.js: ../node_modules/socket.io-client/socket.io.js
	../node_modules/.bin/uglifyjs $^ > $@

clean:
	rm -f style/style.css assets/socket.io.min.js

all: style/style.css assets/socket.io.min.js
