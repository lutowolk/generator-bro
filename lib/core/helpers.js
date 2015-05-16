'use strict';

var _ = require('lodash');

module.exports = {
    /**
     * Take yeoman generator at first arguments and objects for all arguments.
     * Then merge all objects and extend given generator with this merged
     * objects.
     *
     * Usage:
     *
     * extendOf(generator, obj1, obj2, ... objn);
     *
     * @param generator
     * @param {Object}
     * @returns generator
     */
    extendOf: function (generator) {
        var objs = _
            .chain(arguments)
            .drop()
            .merge()
            .value();

        return generator.extend(objs);
    }
};