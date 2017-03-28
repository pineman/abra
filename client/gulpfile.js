'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const rm = require('rimraf').sync;
const path = require('path');

const OUT_DIR = 'serve';

const LESS_IN = 'less/main.less';
const LESS_WATCH = 'less/**/*.less';
const LESS_OUT = `${OUT_DIR}/style.min.css`;

const HTML_IN = 'html/index.html';
const HTML_WATCH = 'hmtl/**/*.html';
const HTML_OUT = `${OUT_DIR}/index.html`;

const JS_IN = 'js/main.js';
const JS_WATCH = 'js/**/*.js';
const JS_OUT = `${OUT_DIR}/abra.min.js`;

function run(command) {
	command = command.split(' ');
	const proc = spawn(command[0], command.slice(1), {
		stdio: 'inherit',
		shell: true
	});
	proc.on('close', (code) => {
		if (code) process.exit(code);
	});
}

gulp.task('default', ['less', 'html', 'js']);

gulp.task('clean', () => {
	rm(LESS_OUT);
	rm(LESS_OUT + '.map');
	rm(JS_OUT);
	rm(JS_OUT + '.map');
	rm(HTML_OUT);
});

gulp.task('watch', () => {
	gulp.watch(LESS_WATCH, ['less']);
	gulp.watch(HTML_WATCH, ['html']);
	gulp.watch(JS_WATCH, ['js']);
});

gulp.task('less', function (done) {
	const opt = [
		'--source-map',
		'--source-map-less-inline',
		'--clean-css',
		'--autoprefix="last 2 versions"'
	].join(' ');

	run(`lessc ${opt} ${LESS_IN} ${LESS_OUT}`);
	done();
});

gulp.task('html', function (done) {
	const opt = [
		'--remove-comments',
		'--sort-attributes',
		'--sort-class-name',
		'--remove-redundant-attributes',
		'--collapse-whitespace',
		'--conservative-collapse'
	].join(' ');

	run(`html-minifier ${opt} ${HTML_IN} -o ${HTML_OUT}`);
	done();
});

gulp.task('js', function (done) {
	const opt = [
		`--in-source-map ${JS_OUT}.map`,
		`--source-map ${JS_OUT}.map`,
		`--source-map-url ${path.basename(JS_OUT)}.map`,
		'-m -r "require,exports"',
		'-c'
	].join(' ');

	run(`browserify --debug --entry ${JS_IN} | exorcist ${JS_OUT}.map > ${JS_OUT} && uglifyjs ${opt} --output ${JS_OUT} ${JS_OUT}`);
	done();
});
