const path = require('path');
const fs = require('fs');
const dom = require('jsdom-sandbox');

module.exports = function (data, grunt) {
  fs.mkdirSync(path.resolve(__dirname, '../../../build'), {recursive: true});
  let files = fs.readdirSync(path.resolve(__dirname, '../../..', 'censhare/assets'));
  files.forEach(function (file) {
    exportFile(file);
  })
};

const asset_types = {
	'module.oc.component.': 'censhare/components',
	'module.oc.skin.': 'templates',
	'module.dialog.': 'censhare/dialogs',
	'module.oc.widget.': 'censhare/widgets',
	'module.localization.': 'censhare/dialogs'
}

function exportFile (file) {
	file = path.resolve(__dirname, '../../..', 'censhare/assets', file);
	console.log(file);
	let data = fs.readFileSync(file);
	dom.sandbox(data.toString(), {}, function (jsdom) {
		let asset = jsdom.window.document.body.firstChild;
		let type = asset.getAttribute('type');
		let uuid = asset.querySelector("asset_feature[feature='censhare:uuid']").getAttribute('value_string');
		let sfile = asset.querySelector("storage_item[key='master']").getAttribute('relpath');
		let dirloc = asset_types[type];
		if (dirloc) {
			console.log(uuid, sfile);
			fs.copyFileSync(file, path.resolve(__dirname, '../../../build', uuid + '.asset.xml'));
			fs.copyFileSync(path.resolve(__dirname, '../../../', dirloc, sfile.substring(14)), path.resolve(__dirname, '../../../build', sfile.substring(5)));
		}
	})
}
