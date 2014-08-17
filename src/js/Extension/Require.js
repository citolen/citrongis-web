/*
**  Require.js
**
**  Author citole_n
**  17/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};

/*
**  Require an extension or file
*/
C.Extension.Require = function (path) {
    if (this.handle && this.module && this.package) { /* Called from an extension context */
        if (this.handle.file(path)) { /* file found in the extension */
            return (this.handle.file(path).asText());
        }
    } else {

    }
    return (undefined);
};
