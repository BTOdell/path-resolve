"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var resolve;
try {
    // Attempt to load Node.js path.resolve
    resolve = require("path").resolve;
}
catch (_a) {
    // If require("path") fails, then load polyfill
    var SLASH_1 = 47;
    var DOT_1 = 46;
    /**
     * Resolves . and .. elements in a path with directory names
     * @param {string} path
     * @param {boolean} allowAboveRoot
     * @return {string}
     */
    var normalizeStringPosix_1 = function (path, allowAboveRoot) {
        var res = '';
        var lastSlash = -1;
        var dots = 0;
        var code = void 0;
        var isAboveRoot = false;
        for (var i = 0; i <= path.length; ++i) {
            if (i < path.length) {
                code = path.charCodeAt(i);
            }
            else if (code === SLASH_1) {
                break;
            }
            else {
                code = SLASH_1;
            }
            if (code === SLASH_1) {
                if (lastSlash === i - 1 || dots === 1) {
                    // NOOP
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 || !isAboveRoot ||
                        res.charCodeAt(res.length - 1) !== DOT_1 ||
                        res.charCodeAt(res.length - 2) !== DOT_1) {
                        if (res.length > 2) {
                            var start = res.length - 1;
                            var j = start;
                            for (; j >= 0; --j) {
                                if (res.charCodeAt(j) === SLASH_1) {
                                    break;
                                }
                            }
                            if (j !== start) {
                                res = (j === -1) ? '' : res.slice(0, j);
                                lastSlash = i;
                                dots = 0;
                                isAboveRoot = false;
                                continue;
                            }
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = '';
                            lastSlash = i;
                            dots = 0;
                            isAboveRoot = false;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0) {
                            res += '/..';
                        }
                        else {
                            res = '..';
                        }
                        isAboveRoot = true;
                    }
                }
                else {
                    var slice = path.slice(lastSlash + 1, i);
                    if (res.length > 0) {
                        res += '/' + slice;
                    }
                    else {
                        res = slice;
                    }
                    isAboveRoot = false;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === DOT_1 && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    };
    /**
     * https://nodejs.org/api/path.html#path_path_resolve_paths
     * @param {...string} paths A sequence of paths or path segments.
     * @return {string}
     */
    resolve = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd = void 0;
        for (var i = paths.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = void 0;
            if (i >= 0) {
                path = paths[i];
            }
            else {
                if (cwd === void 0) {
                    var pathname = window.location.pathname;
                    cwd = pathname.slice(0, pathname.lastIndexOf("/") + 1);
                }
                path = cwd;
            }
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === SLASH_1;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path (removes leading slash)
        resolvedPath = normalizeStringPosix_1(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
            return "/" + resolvedPath;
        }
        else if (resolvedPath.length > 0) {
            return resolvedPath;
        }
        else {
            return '.';
        }
    };
}
module.exports = resolve;
