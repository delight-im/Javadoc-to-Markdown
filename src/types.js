/**
 * used to store type specific options
 */
const supportedTypes = {
    javadoc: {
        method: 'fromJavadoc'
    },
    phpdoc: {
        method: 'fromPHPDoc'
    },
    jsdoc: {
        method: 'fromJSDoc'
    }
};
module.exports = supportedTypes;