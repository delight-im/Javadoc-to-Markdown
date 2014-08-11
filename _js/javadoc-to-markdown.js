/**
 * Generate Markdown from your Javadoc, PHPDoc or JSDoc comments
 *
 * Usage: Create a new instance of <code>JavadocToMarkdown</code> and then
 * call either <code>fromJavadoc()</code>, <code>fromPHPDoc()</code> or <code>fromJSDoc()</code>
 *
 * @constructor
 */
var JavadocToMarkdown = function () {

    "use strict";

    var self = this;

    /**
     * Generates Markdown documentation from code on a more abstract level
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @param {function} fnAddTagsMarkdown the function that processes doc tags and generates the Markdown documentation
     * @returns {string} the Markdown documentation
     */
    function fromDoc(code, headingsLevel, fnAddTagsMarkdown) {
        var i,
            out,
            sections;

        // get all documentation sections from code
        sections = getSections(code);
        // initialize a string buffer
        out = [];

        out.push("#".repeat(headingsLevel)+" Documentation");

        for (i = 0; i < sections.length; i++) {
            out.push(fromSection(sections[i], headingsLevel, fnAddTagsMarkdown));
        }

        // return the contents of the string buffer
        return out.join("");
    }

    /**
     * Generates Markdown documentation from a statically typed language's doc comments
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @returns {string} the Markdown documentation
     */
    this.fromStaticTypesDoc = function(code, headingsLevel) {
        return fromDoc(code, headingsLevel, function(tag, assocBuffer) {
            var tokens;
            switch (tag.key) {
                case "abstract": addToBuffer(assocBuffer, "Abstract", tag.value); break;
                case "access": addToBuffer(assocBuffer, "Access", tag.value); break;
                case "author": addToBuffer(assocBuffer, "Author", tag.value); break;
                case "constructor": addToBuffer(assocBuffer, "Constructor", null); break;
                case "copyright": addToBuffer(assocBuffer, "Copyright", tag.value); break;
                case "deprec":
                case "deprecated": addToBuffer(assocBuffer, "Deprecated", null); break;
                case "example": addToBuffer(assocBuffer, "Example", tag.value); break;
                case "exception":
                case "throws":
                    tokens = tag.value.tokenize(/\s+/g, 2);
                    addToBuffer(assocBuffer, "Exceptions", "`"+tokens[0]+"` — "+tokens[1]);
                    break;
                case "exports": addToBuffer(assocBuffer, "Exports", tag.value); break;
                case "license": addToBuffer(assocBuffer, "License", tag.value); break;
                case "link": addToBuffer(assocBuffer, "Link", tag.value); break;
                case "name": addToBuffer(assocBuffer, "Alias", tag.value); break;
                case "package": addToBuffer(assocBuffer, "Package", tag.value); break;
                case "param":
                    tokens = tag.value.tokenize(/\s+/g, 2);
                    addToBuffer(assocBuffer, "Parameters", "`"+tokens[0]+"` — "+tokens[1]);
                    break;
                case "private": addToBuffer(assocBuffer, "Private", null); break;
                case "return":
                case "returns": addToBuffer(assocBuffer, "Returns", tag.value); break;
                case "see": addToBuffer(assocBuffer, "See also", tag.value); break;
                case "since": addToBuffer(assocBuffer, "Since", tag.value); break;
                case "static": addToBuffer(assocBuffer, "Static", tag.value); break;
                case "subpackage": addToBuffer(assocBuffer, "Sub-package", tag.value); break;
                case "this": addToBuffer(assocBuffer, "This", "`"+tag.value+"`"); break;
                case "todo": addToBuffer(assocBuffer, "To-do", tag.value); break;
                case "version": addToBuffer(assocBuffer, "Version", tag.value); break;
                default: break;
            }
        });
    };

    /**
     * Generates Markdown documentation from a dynamically typed language's doc comments
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @param {function} fnFormatType the function that formats a type information (single argument)
     * @param {function} fnFormatTypeAndName the function that formats type and name information (two arguments)
     * @returns {string} the Markdown documentation
     */
    this.fromDynamicTypesDoc = function(code, headingsLevel, fnFormatType, fnFormatTypeAndName) {
        return fromDoc(code, headingsLevel, function(tag, assocBuffer) {
            var tokens;
            switch (tag.key) {
                case "abstract": addToBuffer(assocBuffer, "Abstract", tag.value); break;
                case "access": addToBuffer(assocBuffer, "Access", tag.value); break;
                case "author": addToBuffer(assocBuffer, "Author", tag.value); break;
                case "constructor": addToBuffer(assocBuffer, "Constructor", null); break;
                case "copyright": addToBuffer(assocBuffer, "Copyright", tag.value); break;
                case "deprec":
                case "deprecated": addToBuffer(assocBuffer, "Deprecated", null); break;
                case "example": addToBuffer(assocBuffer, "Example", tag.value); break;
                case "exception":
                case "throws":
                    tokens = tag.value.tokenize(/\s+/g, 2);
                    addToBuffer(assocBuffer, "Exceptions", fnFormatType(tokens[0])+" — "+tokens[1]);
                    break;
                case "exports": addToBuffer(assocBuffer, "Exports", tag.value); break;
                case "license": addToBuffer(assocBuffer, "License", tag.value); break;
                case "link": addToBuffer(assocBuffer, "Link", tag.value); break;
                case "name": addToBuffer(assocBuffer, "Alias", tag.value); break;
                case "package": addToBuffer(assocBuffer, "Package", tag.value); break;
                case "param":
                    tokens = tag.value.tokenize(/\s+/g, 3);
                    addToBuffer(assocBuffer, "Parameters", fnFormatTypeAndName(tokens[0], tokens[1])+" — "+tokens[2]);
                    break;
                case "private": addToBuffer(assocBuffer, "Private", null); break;
                case "return":
                case "returns":
                    tokens = tag.value.tokenize(/\s+/g, 2);
                    addToBuffer(assocBuffer, "Returns", fnFormatType(tokens[0])+" — "+tokens[1]);
                    break;
                case "see": addToBuffer(assocBuffer, "See also", tag.value); break;
                case "since": addToBuffer(assocBuffer, "Since", tag.value); break;
                case "static": addToBuffer(assocBuffer, "Static", tag.value); break;
                case "subpackage": addToBuffer(assocBuffer, "Sub-package", tag.value); break;
                case "this": addToBuffer(assocBuffer, "This", "`"+tag.value+"`"); break;
                case "todo": addToBuffer(assocBuffer, "To-do", tag.value); break;
                case "var":
                    tokens = tag.value.tokenize(/\s+/g, 2);
                    addToBuffer(assocBuffer, "Type", fnFormatType(tokens[0])+" — "+tokens[1]);
                    break;
                case "version": addToBuffer(assocBuffer, "Version", tag.value); break;
                default: break;
            }
        });
    };

    /**
     * Generates Markdown documentation from Javadoc comments
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @returns {string} the Markdown documentation
     */
    this.fromJavadoc = function(code, headingsLevel) {
        return self.fromStaticTypesDoc(code, headingsLevel);
    };

    /**
     * Generates Markdown documentation from PHPDoc comments
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @returns {string} the Markdown documentation
     */
    this.fromPHPDoc = function(code, headingsLevel) {
        return self.fromDynamicTypesDoc(
            code,
            headingsLevel,
            function (type) {
                return "`"+type+"`";
            },
            function (type, name) {
                // if we have a valid name (and type)
                if (/^\$([a-zA-Z0-9_$]+)$/.test(name)) {
                    return "`"+name+"` — `"+type+"`";
                }
                // if it seems we only have a name
                else {
                    // return the name that was, wrongly, in the position of the type
                    return "`"+type+"`";
                }
            }
        );
    };

    /**
     * Generates Markdown documentation from JSDoc comments
     *
     * @param {string} code the code that contains doc comments
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @returns {string} the Markdown documentation
     */
    this.fromJSDoc = function(code, headingsLevel) {
        return self.fromDynamicTypesDoc(
            code,
            headingsLevel,
            function (type) {
                return "`"+type.substr(1, type.length-2)+"`";
            },
            function (type, name) {
                // if we have a valid type (and name)
                if (/^\{([^{}]+)\}$/.test(type)) {
                    return "`"+name+"` — `"+type.substr(1, type.length-2)+"`";
                }
                // if it seems we only have a name
                else {
                    // return the name that was, wrongly, in the position of the type
                    return "`"+type+"`";
                }
            }
        );
    };

    /**
     * Generates Markdown documentation from a given section
     *
     * The function processes units of documentation, a line of code with accompanying doc comment
     *
     * @param {object} section the section that consists of code line and doc comment
     * @param {number} headingsLevel the headings level to use as the base (1-6)
     * @param {function} fnAddTagsMarkdown the function that processes doc tags and generates the Markdown documentation
     * @returns {string} the Markdown documentation
     */
    function fromSection(section, headingsLevel, fnAddTagsMarkdown) {
        var assocBuffer,
            description,
            field,
            out,
            p,
            t,
            tags;

        // initialize a string buffer
        out = [];

        // first get the field that we want to describe
        field = getFieldDeclaration(section.line);
        // if there is no field to describe
        if (!field) {
            // do not return any documentation
            return "";
        }

        out.push("\n\n");
        out.push("#".repeat(headingsLevel+1)+" `"+field+"`");

        description = getDocDescription(section.doc);
        if (description.length) {
            out.push("\n\n");
            out.push(description);
        }

        tags = getDocTags(section.doc);
        if (tags.length) {
            out.push("\n");

            assocBuffer = {};
            for (t = 0; t < tags.length; t++) {
                fnAddTagsMarkdown(tags[t], assocBuffer);
            }

            for (p in assocBuffer) {
                if (assocBuffer.hasOwnProperty(p)) {
                    out.push(fromTagGroup(p, assocBuffer[p]));
                }
            }
        }

        // return the contents of the string buffer
        return out.join("");
    }

    function fromTagGroup(name, entries) {
        var i,
            out;

        // initialize a string buffer
        out = [];

        out.push("\n");
        if (entries.length === 1 && entries[0] === null) {
            out.push(" * **"+name+"**");
        }
        else {
            out.push(" * **"+name+":**");
            if (entries.length > 1) {
                for (i = 0; i < entries.length; i++) {
                    out.push("\n");
                    out.push("   * "+entries[i]);
                }
            }
            else if (entries.length === 1) {
                out.push(" "+entries[0]);
            }
        }

        // return the contents of the string buffer
        return out.join("");
    }

    function getSections(code) {
        var docLine,
            fieldDeclaration,
            m,
            out,
            regex;

        regex = /\/\*\*([^]*?)\*\/([^{;/]+)/gm;
        out = [];

        while ((m = regex.exec(code)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (typeof m[1] === "string" && m[1] !== null) {
                if (typeof m[2] === "string" && m[2] !== null) {
                    fieldDeclaration = m[2].trim();
                    docLine = m[1];

                    // if the source code line is an import statement
                    if (/^import\s+/.test(fieldDeclaration)) {
                        // ignore this piece
                        continue;
                    }

                    // if this is a single line comment
                    if (docLine.indexOf("*") === -1) {
                        // prepend an asterisk to achieve the normal line structure
                        docLine = "*"+docLine;
                    }

                    // interpret empty lines as if they contained a p-tag
                    docLine = docLine.replace(/\*[ ]*$/gm, "* <p>");

                    out.push({ "line": fieldDeclaration, "doc": docLine });
                }
            }
        }

        return out;
    }

    function getFieldDeclaration(line) {
        var regex = /^([^\{;]+)(.*?)$/gm;
        var m;

        while ((m = regex.exec(line)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (typeof m[1] === "string" && m[1] !== null) {
                return cleanSingleLine(m[1]);
            }
        }

        return "";
    }

    function getDocDescription(docLines) {
        var regex = /^(\t| )*?\*(\t| )+([^@].*)$/gm;
        var m;
        var out = [];

        while ((m = regex.exec(docLines)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (typeof m[3] === "string" && m[3] !== null) {
                out.push(cleanLine(m[3]));
            }
        }

        return cleanLine(out.join(" ").replace(/<(\/)?p>/gi, "\n\n"));
    }

    function getDocTags(docLines) {
        var regex = /^(\t| )*?\*(\t| )*?@([a-zA-Z]+)(.*)$/gm;
        var m;
        var out = [];

        while ((m = regex.exec(docLines)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (typeof m[3] === "string" && m[3] !== null) {
                if (typeof m[4] === "string" && m[4] !== null) {
                    out.push({ "key": cleanSingleLine(m[3]), "value": cleanSingleLine(m[4]) });
                }
            }
        }

        return out;
    }

    function cleanLine(line) {
        // trim leading and trailing spaces
        line = line.trim();

        // clear spaces after line breaks and tabs
        line = line.replace(/([\n\r\t])[ ]+/gm, "$1");

        // make consecutive spaces one
        line = line.replace(/[ ]{2,}/g, " ");

        return line;
    }

    function cleanSingleLine(line) {
        // perform normal line cleaning
        line = cleanLine(line);

        // replace line breaks and tabs with spaces
        line = line.replace(/(\n|\r|\t)/g, " ");

        return line;
    }

    function addToBuffer(buffer, key, value) {
        if (typeof buffer[key] === "undefined" || buffer[key] === null) {
            buffer[key] = [];
        }
        buffer[key].push(value);
    }

    String.prototype.tokenize = function(splitByRegex, limit) {
        var counter,
            i,
            m,
            start,
            tokens;

        tokens = [];
        counter = 1;
        start = 0;

        while ((m = splitByRegex.exec(this)) !== null) {
            if (m.index === splitByRegex.lastIndex) {
                splitByRegex.lastIndex++;
            }

            if (counter < limit) {
                tokens.push(this.substring(start, m.index));
                start = m.index + m[0].length;
            }

            counter++;
        }

        // add the remainder as a single part
        tokens.push(this.substring(start));

        // fill the array to match the limit if necessary
        for (i = tokens.length; i < limit; i++) {
            tokens.push("");
        }

        return tokens;
    };

    String.prototype.repeat = function(count) {
        return new Array(count + 1).join(this);
    };

};
