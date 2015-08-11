import Private from './Private';

let fileElement = new Private(),
	element = new Private(),
	DEFAULT_OPTS = {
		allowMultiple: true,
		accept: null,
		uploadURL: '/',
		fieldName: 'file[]',
		progressBar: null,
		beforeFileSelect: (e) => {
			console.log('beforeFileSelect', e);
		},
		onFileSelect: (e, files) => {
			console.log('onFileSelect', e, files);
		},
		beforeUpload: (xhr) => {
			console.log('beforeUpload', xhr);
		},
		onProgress: (e, percent) => {
			console.log('onProgress', e, percent);
		},
		afterUpload: (e) => {
			console.log('afterUpload', e);
		},
		onError: (e) => {

		}
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
	} else {
		elem = [document.createElement('a')];
	}

	return elem;
}

export default class Uploader {

	static get DEFAULT_OPTS() {
		return DEFAULT_OPTS;
	}

	constructor(elem, opts) {
		elem = _convertElement(elem);
		opts = _extend(DEFAULT_OPTS, opts || {});

		if (opts.progressBar) {
			opts.progressBar = _convertElement(opts.progressBar);
		}

		var input = document.createElement('input');
		input.setAttribute('type', 'file');

		if (opts.allowMultiple) {
			input.setAttribute('multiple', 'multiple');
		}

		if (opts.accept !== null) {
			input.setAttribute('accept', opts.accept);
		}

		fileElement.set(this, input);


		[].forEach.call(elem, (el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				if (opts.beforeFileSelect(e) !== false) {
					input.click();
				}
			})
		});

		input.addEventListener('change', function(e) {
			var data = new FormData();

			for (let i in this.files) {
				data.append(opts.fieldName, this.files[i]);
			}

			if (opts.onFileSelect(e, this.files, data) !== false) {
				var req = new XMLHttpRequest();

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
					opts.onProgress(e, percent);
				});

				req.upload.addEventListener('load', (e) => {
					opts.afterUpload(e);
				});

				req.upload.addEventListener('error', (e) => {
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
}
