var chai = require('chai'),
    fs = require('fs'),
    lib = require('../');

chai.should();
var expect = chai.expect;

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
        it('should convert phpdoc to markdown when valid file is passed', function() {
            var file = fs.readFileSync('./examples/PHPDoc.txt', 'utf8');
            var expected = fs.readFileSync('./examples/PHPDoc.expected.txt', 'utf8');

            var output = javadocToMarkdown.convertCode('phpdoc', file, 1);
            output.should.be.eql(expected);
        });   
    });

    describe('jsdoc Suite: ', function() {   
        it('should convert jsdoc to markdown when valid file is passed', function() {
            var file = fs.readFileSync('./examples/JSDoc.txt', 'utf8');
            var expected = fs.readFileSync('./examples/JSDoc.expected.txt', 'utf8');

            var output = javadocToMarkdown.convertCode('JSDoc', file, 1);
            output.should.be.eql(expected);
        });   
    });

    describe('Error Cases: ', function() {   
        it('should throw err when invalid lang type is specified', function() {
            var file = fs.readFileSync('./examples/JSDoc.txt', 'utf8');

            expect(javadocToMarkdown.convertCode.bind(javadocToMarkdown, 'JSDocsss', file, 1))
            .to
            .throw('Unsupported language JSDocsss');
        });   
    });
 
});