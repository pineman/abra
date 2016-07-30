.DEFAULT_GOAL := devel

LESS := $(wildcard *.less)
style.css: $(LESS)
	../../node_modules/.bin/lessc --clean-css="--advanced" --autoprefix="last 2 versions" main.less $@

devel: style.css

clean:
	rm -f style.css
