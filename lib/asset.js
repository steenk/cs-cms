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
	}, content);
}

function child_asset_rel (params, self) {
	return element('child_asset_rel', params, {
		child_currversion: 0,
		deletion: 0,
		has_update_child_geometry: 0,
		has_update_content: 0,
		iscancellation: 0,
		isversioned: 0,
		parent_asset_ref_file: self,
		parent_currversion: 0,
		variant_automatic: 0,
		variant_update_flag: 0
	});
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

module.exports = {asset, asset_feature, storage_item, asset_element, child_asset_rel}
