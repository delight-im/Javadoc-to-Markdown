var chai = require('chai'),
    fs = require('fs'),
    lib = require('../');

chai.should();

var JavadocToMarkdown = lib.JavadocToMarkdown;
var javadocToMarkdown = new JavadocToMarkdown();

describe('JavadocToMarkdown Suite: ', function() {
    
    describe('Javadoc Suite: ', function() {
        it('should convert javadoc to markdown when valid file is passed', function() {
            var javaFile = fs.readFileSync('./examples/Javadoc.txt', 'utf8');
            var expected = fs.readFileSync('./examples/Javadoc.expected.txt', 'utf8');

            var output = javadocToMarkdown.convertCode('javadoc', javaFile, 1);
            output.should.be.eql(expected);

        });  
    });

    describe('phpdoc Suite: ', function() {   
        it('should convert javadoc to markdown when valid file is passed', function() {
            var javaFile = fs.readFileSync('./examples/PHPDoc.txt', 'utf8');
            var expected = fs.readFileSync('./examples/PHPDoc.expected.txt', 'utf8');

            var output = javadocToMarkdown.convertCode('phpdoc', javaFile, 1);
            output.should.be.eql(expected);

        });   
    });

    describe('jsdoc Suite: ', function() {   
        it('should convert javadoc to markdown when valid file is passed', function() {
            var javaFile = fs.readFileSync('./examples/JSDoc.txt', 'utf8');
            var expected = fs.readFileSync('./examples/JSDoc.expected.txt', 'utf8');

            var output = javadocToMarkdown.convertCode('JSDoc', javaFile, 1);
            output.should.be.eql(expected);

        });   
    });

    
});