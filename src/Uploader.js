import Private from './Private';

delete window.Private;

let fileElement = new Private(),
	element = new Private(),
	DEFAULT_OPTS = {
		allowMultiple: true,
		singleRequest: true,
		accept: null,
		uploadURL: '/',
		fieldName: 'file[]',
		progressBar: null,
		beforeFileSelect: (e) => {},
		onFileSelect: (e, files) => {},
		beforeUpload: (xhr) => {},
		onProgress: (e, percent) => {},
		afterUpload: (e) => {},
		onSuccess: (res, xhr, e) => {},
		onError: (e) => {}
	};

function _extend(obj1, obj2) {
	for (var key in obj2) {
		obj1[key] = obj2[key];
	}
	return obj1;
}

function _convertElement(elem) {
	if(elem instanceof HTMLElement) {
		elem = [elem];
	} else if (typeof elem === 'string' && elem !== '') {
		elem = document.querySelectorAll(elem);
	} else if(Array.isArray(elem)) {
		var tmpElem = [];
		elem.forEach((el) => {
			tmpElem.concat(_convertElement(el));
		});
		elem = tmpElem;
	} else if (!elem) {
		elem = [document.createElement('button')];
	}

	return elem;
}

export default class Uploader {

	static get DEFAULT_OPTS() {
		return DEFAULT_OPTS;
	}

	get element() {
		return element.get(this);
	}

	constructor(elem, opts) {
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



		[].forEach.call(elem, (el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				if (opts.beforeFileSelect(e) !== false) {
					input.click();
				}
			})
		});

		input.addEventListener('change', function(e) {
			if (opts.onFileSelect(this.files, e) !== false) {
				[].forEach.call((opts.singleRequest)?[null]:this.files,
					(file) => {
						var data = new FormData(),
							req = new XMLHttpRequest();

						if (file === null) {
							for (let i in this.files) {
								data.append(opts.fieldName, this.files[i]);
							}
						} else {
							data.append(opts.fieldName, file);
						}

						req.upload.addEventListener('progress', (e) => {
							var percent = null;
							if (e.lengthComputable) {
								percent = Math.round(((e.loaded * 100) / e.total) * 100) / 100;
								if (opts.progressBar) {
									[].forEach.call(opts.progressBar, (bar) => {
										bar.style.width = Math.round(percent)+'%';
									});
								}
							}
							e.currentFile = file;
							opts.onProgress(percent, e);
						});

						req.upload.addEventListener('load', (e) => {
							opts.afterUpload(req);
						});

						req.addEventListener('loadend', (e) => {
							e.currentFile = file;
							opts.onSuccess(e.target.response, e.target, e);
						})

						req.upload.addEventListener('error', (e) => {
							opts.onError(e);
						});

						req.open('POST', opts.uploadURL);
						req.setRequestHeader('Cache-Control', 'no-cache');

						if (opts.beforeUpload(req, data) !== false) {
							req.send(data);
						}
					});
			}
		});
	}
}
