const $$$ = require('tripledollar');

function asset (params) {
	return element('asset', params, {
		application: 'default', 
   		domain: 'root.', 
   		domain2: 'root.',
   		language: '', 
   		name: '',
   		type: 'text.'
	});
}

function asset_feature (params, content) {
	return element('asset_feature', params, {
		isversioned: 1
	}, content);
}

function storage_item (params) {
	return element('storage_item', params, {
		element_idx: 0,
		key: 'master'
	});
}

function asset_element (params) {
	return element('asset_element', params, {
		idx: 0,
		isversioned: 1,
		key: 'actual.',
		version: 0
	});
}

function xmldata (list) {
	return ['xmldata', list];
}

function element (name, params, attr, content) {
	Object.keys(params||{}).forEach(function (key) {
		attr[key] = params[key];
	});
	let el = [name, attr];
	if (content) {
		el.push(xmldata(content));
	}
	return $$$(el);
}

module.exports = {asset, asset_feature, storage_item, asset_element}
