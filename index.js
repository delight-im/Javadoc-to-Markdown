const _ = require('lodash');
const fs = require('fs-extra');
const async = require('async');
const javadocToMarkdown = require('./_js/javadoc-to-markdown.js');

const DEFAULT_HEADINGS_LEVEL = 2;
const DEFAULT_FILENAME_PATTERN = /\S+\.[jJ][aA][vV][aA]$/; // any java file
const DEFAULT_FILE_CONTENTS_PATTERN = /\S+/; // any non-empty contents

function _optionsVal(options, property, defaultValue) {
	const value = (_.isPlainObject(options) ? options : {})[property || ''];

	return _.isFunction(defaultValue) ? defaultValue(value) : (_.isNil(value) ? defaultValue : value);
}

function fromSources(sources, options, cb) {
	if (!sources) return cb(new Error('`sources` required'));
	if (_.isString(sources)) sources = [sources]; // coerce to array
	if (_.isFunction(options) && !cb) cb = options;

	const isObj = _.isPlainObject(sources);
	const headingLevel = _optionsVal(options, 'headingsLevel', DEFAULT_HEADINGS_LEVEL);

	async.reduce(isObj ? _.keys(sources) : sources, isObj ? {} : [], (acc, source, done) => {
		try {
			let md = javadocToMarkdown.fromJavadoc(isObj ? sources[source] : source, headingLevel);
			if (md) isObj ? acc[source] = md : acc.push(md);
			return done(null, acc);
		} catch (err) {
			return done(err);
		}
	}, cb);
}

function fromSourceDir(sourceDir, options, cb) {
	if (!sourceDir) return cb(new Error('`sourceDir` required'));
	if (_.isFunction(options) && !cb) cb = options;

	const srcDir = sourceDir + (sourceDir.endsWith('/') ? '' : '/');

	async.auto({
		files: cb => fs.readdir(srcDir, cb),
		sources: ['files', (ctx, cb) => {
			async.reduce(ctx.files, {}, (acc, file, done) => {
				const nameMatcher = _optionsVal(options, 'includeFilenames', pattern => {
					return !pattern ? DEFAULT_FILENAME_PATTERN : (_.isRegExp(pattern) ? pattern : new RegExp(pattern));
				});

				const contentsMatcher = _optionsVal(options, 'includeFileContents', pattern => {
					return !pattern ? DEFAULT_FILE_CONTENTS_PATTERN : (_.isRegExp(pattern) ? pattern : new RegExp(pattern));
				});

				if (!nameMatcher.test(file)) return done(null, acc);

				fs.readFile(srcDir + file, 'UTF-8', (err, contents) => {
					if (err) return done(err);

					if (contentsMatcher.test(contents)) acc[file.substr(0, file.indexOf('.'))] = contents;

					done(null, acc);
				});
			}, cb);
		}],
		markdown: ['sources', (ctx, cb) => fromSources(ctx.sources, options, cb)]
	}, (err, ctx) => cb(err, ctx.markdown));
}

function output(sourceDir, options, cb) {
	if (!sourceDir) return cb(new Error('`sourceDir` required'));

	const outputDir = _optionsVal(options, 'outputDir', dir => dir ? dir + (dir.endsWith('/') ? '' : '/') : dir);
	const outputFile = _optionsVal(options, 'outputFile');

	if (outputDir && outputFile) {
		return cb(new Error('only one of `options.outputDir` or `options.outputFile` allowed'));
	}

	fromSourceDir(sourceDir, options, (err, mds) => {
		if (err) return cb(err);

		if (outputDir) fs.mkdirsSync(outputDir);

		async.reduce(_.keys(mds), [], (outputs, srcName, done) => {
			let md = '#' + srcName + "\n" + mds[srcName];

			if (outputFile) return fs.appendFile(outputFile, md, 'UTF-8', err => {
				if (!err && !outputs.length) outputs.push(outputFile);
				done(err, outputs);
			});

			if (outputDir) {
				const file = outputDir + srcName + '.md';
				return fs.writeFile(file, md, 'UTF-8', err => {
					if (!err) outputs.push(file);
					done(err, outputs);
				});
			}

			console.log(md);
			done(null);
		}, cb);
	});
}

exports.fromSources = fromSources;
exports.fromSourceDir = fromSourceDir;
exports.output = output;
