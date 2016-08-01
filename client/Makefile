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
	# backup
	cp index.html index.html.tmp
	# replace references to JS files in index.html
	find * -maxdepth 0 -name "*.js" -exec sed -i "/{}/d" index.html.tmp \;
	# insert <script> right after title tag
	sed -i -E '/.*id="getname".*/i<script src="\/abra.min.js"></script>' index.html.tmp
	# minify JS files, enclosing everything in an IIFE
	../node_modules/.bin/uglifyjs -m toplevel -c dead_code,conditionals,loops,evaluate,comparisons,unused,hoist_funs,hoist_vars,join_vars,if_return,drop_console -- *.js > abra.min.js
	sed -i '1i (function () {' abra.min.js
	echo '})();' >> abra.min.js
	# minify index.html
	../node_modules/.bin/html-minifier --remove-comments --remove-optional-tags --collapse-whitespace --remove-empty-attributes --remove-redundant-attributes --remove-attribute-quotes index.html.tmp > index.min.html.tmp
	rm index.html.tmp
	# Move everything to serve dir for static serving by nginx
	mkdir -p serve/{assets,style}
	mv index.min.html.tmp serve/index.html
	cp style/style.css serve/style
	cp assets/* serve/assets/
	mv abra.min.js serve/
