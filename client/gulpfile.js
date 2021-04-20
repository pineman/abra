'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const path = require('path');
const rm = require('fs').unlinkSync;

const OUT_DIR = 'serve';

const LESS_DIR = 'less';
const LESS_IN = `${LESS_DIR}/main.less`;
const LESS_WATCH = `${LESS_DIR}/**/*.less`;
const LESS_OUT = `${OUT_DIR}/style.min.css`;

const HTML_DIR = 'html';
const HTML_IN = `${HTML_DIR}/index.html`;
const HTML_WATCH = `${HTML_DIR}/**/*.html`;
const HTML_OUT = `${OUT_DIR}/index.html`;

const JS_DIR = 'js';
const JS_IN = `${JS_DIR}/main.js`;
const JS_WATCH = `${JS_DIR}/**/*.js`;
const JS_OUT = `${OUT_DIR}/abra.min.js`;

function run(command) {
	console.log(command)
	command = command.split(' ');
	const proc = spawn(command[0], command.slice(1), {
		stdio: 'inherit',
		shell: true
	});
	proc.on('close', (code) => {
		if (code) process.exit(code);
	});
}

gulp.task('clean', (done) => {
	try {
		rm(LESS_OUT);
		rm(LESS_OUT + '.map');
		rm(JS_OUT);
		rm(JS_OUT + '.map');
		rm(HTML_OUT);
	} catch (err) { };
	done();
});

gulp.task('watch', () => {
	gulp.watch(LESS_WATCH, gulp.parallel('less'));
	gulp.watch(HTML_WATCH, gulp.parallel('html'));
	gulp.watch(JS_WATCH, gulp.parallel('js'));
});

gulp.task('less', (done) => {
	const opt = [
		'--verbose',
		'--source-map', 
		'--source-map-include-source',
		'--clean-css'
	].join(' ');

	run(`lessc ${opt} ${LESS_IN} ${LESS_OUT}`);
	done();
});

gulp.task('html', (done) => {
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

gulp.task('js', (done) => {
	const opt = [
		'-m',
		'-c'
	].join(' ');

	run(`browserify --debug --entry ${JS_IN} > ${JS_OUT}.orig && uglifyjs ${JS_OUT}.orig ${opt} > ${JS_OUT}`);
	done();
});

gulp.task('default', gulp.parallel(['less', 'html', 'js']));
