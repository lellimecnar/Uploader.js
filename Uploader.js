/*!
 * Copyright (c) 2015 Lance Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define("Private", ["exports", "module"], factory);
	} else if (typeof exports !== "undefined" && typeof module !== "undefined") {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.Private = mod.exports;
	}
})(this, function (exports, module) {
	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var keys = [],
	    vals = [];

	var Private = (function () {
		function Private() {
			_classCallCheck(this, Private);
		}

		_createClass(Private, [{
			key: "set",
			value: function set(key, val) {
				var index = keys.indexOf(key);

				if (index <= 0) {
					index = keys.push(key) - 1;
				}

				vals[index] = val;
			}
		}, {
			key: "get",
			value: function get(key) {
				return vals[keys.indexOf(key)];
			}
		}]);

		return Private;
	})();

	module.exports = Private;
});
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define('Uploader', ['exports', 'module', './Private'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module, require('./Private'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod, global.Private);
		global.Uploader = mod.exports;
	}
})(this, function (exports, module, _Private) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Private2 = _interopRequireDefault(_Private);

	delete window.Private;

	var fileElement = new _Private2['default'](),
	    element = new _Private2['default'](),
	    DEFAULT_OPTS = {
		allowMultiple: true,
		accept: null,
		uploadURL: '/',
		fieldName: 'file[]',
		progressBar: null,
		beforeFileSelect: function beforeFileSelect(e) {},
		onFileSelect: function onFileSelect(e, files) {},
		beforeUpload: function beforeUpload(xhr) {},
		onProgress: function onProgress(e, percent) {},
		onSuccess: function onSuccess(e) {},
		onError: function onError(e) {}
	};

	function _extend(obj1, obj2) {
		for (var key in obj2) {
			obj1[key] = obj2[key];
		}
		return obj1;
	}

	function _convertElement(elem) {
		if (elem instanceof HTMLElement) {
			elem = [elem];
		} else if (typeof elem === 'string' && elem !== '') {
			elem = document.querySelectorAll(elem);
		} else if (Array.isArray(elem)) {
			var tmpElem = [];
			elem.forEach(function (el) {
				tmpElem.concat(_convertElement(el));
			});
			elem = tmpElem;
		} else if (!elem) {
			elem = [document.createElement('button')];
		}

		return elem;
	}

	var Uploader = (function () {
		_createClass(Uploader, [{
			key: 'element',
			get: function get() {
				return element.get(this);
			}
		}], [{
			key: 'DEFAULT_OPTS',
			get: function get() {
				return DEFAULT_OPTS;
			}
		}]);

		function Uploader(elem, opts) {
			_classCallCheck(this, Uploader);

			elem = _convertElement(elem);
			element.set(this, elem);

			opts = _extend(DEFAULT_OPTS, opts || {});

			if (opts.progressBar) {
				opts.progressBar = _convertElement(opts.progressBar);
			}

			var input = document.createElement('input');
			fileElement.set(this, input);

			input.style.visibility = 'hidden';
			input.style.position = 'fixed';
			input.style.left = '-99999%';
			input.style.top = input.style.left;
			input.style.width = '1px';
			input.style.height = input.style.width;
			document.body.appendChild(input);

			input.setAttribute('type', 'file');

			if (opts.allowMultiple) {
				input.setAttribute('multiple', 'multiple');
			}

			if (opts.accept !== null) {
				input.setAttribute('accept', opts.accept);
			}

			[].forEach.call(elem, function (el) {
				el.addEventListener('click', function (e) {
					e.preventDefault();
					if (opts.beforeFileSelect(e) !== false) {
						input.click();
					}
				});
			});

			input.addEventListener('change', function (e) {
				var data = new FormData();

				for (var i in this.files) {
					data.append(opts.fieldName, this.files[i]);
				}

				if (opts.onFileSelect(e, this.files, data) !== false) {
					var req = new XMLHttpRequest();

					req.upload.addEventListener('progress', function (e) {
						var percent = null;
						if (e.lengthComputable) {
							percent = Math.round(e.loaded * 100 / e.total * 100) / 100;
							if (opts.progressBar) {
								[].forEach.call(opts.progressBar, function (bar) {
									bar.style.width = Math.round(percent) + '%';
								});
							}
						}
						opts.onProgress(e, percent);
					});

					req.upload.addEventListener('load', function (e) {
						opts.onSuccess(e);
					});

					req.upload.addEventListener('error', function (e) {
						opts.onError(e);
					});

					req.open('POST', opts.uploadURL);
					req.setRequestHeader('Cache-Control', 'no-cache');

					if (opts.beforeUpload(req) !== false) {
						req.send(data);
					}
				}
			});
		}

		return Uploader;
	})();

	module.exports = Uploader;
});