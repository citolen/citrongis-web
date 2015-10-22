/*
 *  EditorHandler //TODO description
 */

var EditorHandler = function (options) {

    this._code = options.code || '';

    this._tmpl = options.tmpl || '';

    this._style = options.style || '';

    this._package = JSON.stringify({
        name: 'editor-build',
        "version": "0.0.1",
        "main": "index.js",
        "dependencies": []
    });

    this._code += '\nE.Display("ui/index.tmpl");';
    this._tmpl = '\n{@include src="ui/index.css" /}\n' + this._tmpl;

    this._fileHandles = {
        'index.js':         new EditorFileHandle(this._code),
        'ui/index.tmpl':    new EditorFileHandle(this._tmpl),
        'ui/index.css':     new EditorFileHandle(this._style),
        'package.json':     new EditorFileHandle(this._package)
    };
};

EditorHandler.prototype.file = function (path, callback) {
    if (path in this._fileHandles) {
        var handle = this._fileHandles[path];
        if (handle._content !== undefined) {
            return callback(null, handle);
        } else {
            return callback(true);
        }
    } else {
        callback(true);
    }
};

var EditorFileHandle = function (content) {

    this._content = content;

};

EditorFileHandle.prototype.asText = function () {
    return this._content;
};

module.exports = EditorHandler;
