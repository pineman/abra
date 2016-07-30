.DEFAULT_GOAL := style.css

LESS := $(wildcard *.less)
style.css: $(LESS)
	../../node_modules/.bin/lessc --clean-css="--advanced" --autoprefix="last 2 versions" main.less $@

clean:
	rm -f style.css
