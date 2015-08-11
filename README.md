# Uploader.js

## `new Uploader(element, options);`

| argument | type | description |
|--|--|--|
| `element` | `String`, `HTMLElement` | The element, elements, or selector which will trigger the file upload |
| `options` | `` | See "Options" below |

## Options

| option | default | description |
|--|--|--|
| `allowMultiple` | `true` | Allow upload of multiple files at once |
| `accept` | `null` | Restrict upload to certain content types. for example: `images/*` |
| `uploadURL` | `'/'` | The URL to `POST` the upload to |
| `fieldName` | `'file[]'` | The "name" of the form field your server is watching for |
| `progressBar` | `null` | An element or selector to apply percentage width to for a progress bar |

## Events

All events are passed in as options.

| option | arguments | description |
|--|--|--|
| `beforeFileSelect` | `Event` | Before showing the file dialog. Return `false` to prevent the dialog from showing |
| `onFileSelect` | `Event`, `FileList`, `FormData` | After the files are selected and the `FormData` is created. Return `false` to prevent the `xhr` object from being configured |
| `beforeUpload` | `XMLHttpRequest` | After the `xhr` object is created, but before it's submitted. Return `false` to prevent the actual upload |
| `onProgress` | `XMLHttpRequestProgressEvent`, `percentage` | Fires every time the server updates the upload progress |
| `afterUpload` | `XMLHttpRequestProgressEvent` | The progress has reached 100% and the file(s) have successfully been sent to the server |
| `onError` | `Error` | An error with the request has occurred |
