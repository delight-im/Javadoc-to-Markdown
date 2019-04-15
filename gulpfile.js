const _ = require('lodash');
const argv = require('yargs').argv;
const javadocToMarkdown = require('.');

function toMarkdown(cb) {
	if (!argv.srcDir) return cb(new Error('`--srcDir` required'));
	if (argv.outputDir && argv.outputFile) return cb(new Error('`--outputDir` and `--outputFile` mutually exclusive'));

	javadocToMarkdown.output(argv.srcDir, {
		headingsLevel: argv.headingsLevel || 2,
		outputDir: argv.outputDir,
		outputFile: argv.outputFile
	}, (err, files) => {
		if (files) console.log("Markdown Files:\n  " + files.join("\n  "));
		cb(err);
	});
}

exports.toMarkdown = toMarkdown;
