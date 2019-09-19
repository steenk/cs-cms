const fs = require('fs');
const dom = require('jsdom-sandbox');
const uuid = require('../lib/uuid');
const build = require('../lib/build');
const path = require('path');

module.exports = function (grunt) {
	grunt.registerMultiTask('censhare', 'A build command for censhare cms.', function () {

		let data = this.data;

		if (this.nameArgs === 'censhare:build') {
			build(data, grunt);
		}
		if (this.nameArgs === 'censhare:create') {

			dom.sandbox('', {}, function (jsdom) {
				const $$$ = require('tripledollar');
				const {asset, asset_feature, storage_item, asset_element, child_asset_rel} = require('../lib/asset');
				const {dialog} = require('../lib/dialog');
				const {component} = require('../lib/component');
				const {widgetitem} = require('../lib/widget');
				const {fmmacro} = require('../lib/fmmacro');
				const {localization} = require('../lib/localization');
				const {mimetypes} = require('../lib/mimetypes');

				setup(data);

				function setup (data) {

					data.widgets.forEach(function (widget) {
						let name = widget.name.toLowerCase().replace(/ /g, '_');
						let folder = widget.folder ? widget.folder + '/' : '';
						let s_uuid = uuid();

						// skin
						widget.skin_file = widget.skin_file || name + '.ftl';
						let s = asset({
								name: name,
								type: 'module.oc.skin.'
							})
							.ins(asset_element())
							.ins(asset_feature({
								feature: 'censhare:uuid',
								value_string: s_uuid
							}))
							.ins(asset_feature({
								feature: 'censhare:output-channel',
								value_key: data.channel
							}))
							.ins(storage_item({
								mimetype: 'application/x-freemarker',
								relpath: 'file:' + s_uuid.substring(0, 8) +'_' + widget.skin_file,
								original_path: path.resolve(__dirname, '../../../templates', folder, name + '.ftl')
							}))
						;
						saveFile('censhare/assets/' + name + '_skin_asset.xml', s.outerHTML);

						// freemarker storage item
						let fmm = fmmacro(widget);
						saveFile('templates/' + folder + name + '.ftl', fmm);

						// component
						let c_uuid = uuid();
						widget.component_file = widget.component_file || name + '_component.xml';

						let c = asset({
								name: widget.name,
								type: 'module.oc.component.'
							})
							.ins(asset_element())
							.ins(asset_feature({
								feature: 'censhare:uuid',
								value_string: c_uuid
							}))
							.ins(asset_feature({
								feature: 'censhare:output-channel',
								value_key: data.channel
							}))
							.ins(storage_item({
								mimetype: 'text/xml',
								relpath: 'file:' + c_uuid.substring(0, 8) +'_' + widget.component_file
							}))
						;
						saveFile('censhare/assets/' + name + '_component_asset.xml', c.outerHTML);

						// component storage item
						let comp = component(widget);
						saveFile('censhare/components/' + name + '_component.xml', comp.outerHTML);

						// widget
						let w_uuid = uuid();
						widget.widget_file = widget.widget_file || name + '_widget.xml';

						let w = asset({
								name: widget.name,
								type: 'module.oc.widget.'
							})
							.ins(asset_element())
							.ins(asset_feature({
								feature: 'censhare:asset-flag',
								value_key: 'copy-template'
							}))
							.ins(asset_feature({
								feature: 'censhare:asset-flag',
								value_key: 'is-template'
							}))
							.ins(asset_feature({
								feature: 'censhare:resource-enabled',
								value_long: 1
							}))
							.ins(asset_feature({
								feature: 'censhare:resource-in-cached-tables',
								value_long: 1
							}))
							.ins(asset_feature({
								feature: 'censhare:online-channel.management.dialog-key',
								value_asset_key_ref: 'censhare:oc.dialog.widget-' + name.replace(/_/g, '.'),
								value_string: 'censhare:resource-key'
							}))
							.ins(asset_feature({
								feature: 'censhare:uuid',
								value_string: w_uuid
							}))
							.ins(asset_feature({
								feature: 'censhare:output-channel',
								value_key: data.channel
							}))
							.ins(storage_item({
								mimetype: 'text/xml',
								relpath: 'file:' + w_uuid.substring(0, 8) +'_' + widget.widget_file
							}))
						;
						saveFile('censhare/assets/' + name + '_widget_asset.xml', w.outerHTML);

						// widget storage item
						let wsi = widgetitem(widget);
						saveFile('censhare/widgets/' + name + '_widget.xml', wsi.outerHTML);

						// dialog location
						let locfile = path.resolve(__dirname, '../../../censhare/dialogs/' + (data.prefix||'common') + '_localization.xml');
						let locassetfile = path.resolve(__dirname, '../../../censhare/assets/' + (data.prefix||'common') + '_localization_asset.xml')
						var locfilerel;
						if (!fs.existsSync(locfile) || !fs.existsSync(locassetfile)) {
							if (!fs.existsSync(locassetfile)) {
								let loc_uuid = uuid();
								locfilerel = 'file:' + loc_uuid + '.asset.xml';
								let loc = asset({
									name: 'Online Channel Management Localization',
									type: 'module.localization.',
									application: 'texteditor'
								})
								.ins(asset_element())
								.ins(asset_feature({
									feature: 'censhare:uuid',
									value_string: loc_uuid
								}))
								.ins(storage_item({
									mimetype: 'text/xml',
									relpath: 'file:' + loc_uuid.substring(0, 8) + '_' + (data.prefix||'common') + '_localization.xml'
								}));
								saveFile('censhare/assets/' + (data.prefix||'common') + '_localization_asset.xml', loc.outerHTML);
							}
							if (!fs.existsSync(locfile)) {
								let loccontent = localization(widget);
								saveFile('censhare/dialogs/' + (data.prefix||'common') + '_localization.xml', loccontent.outerHTML);
							}
						} else {
							let curr_locfile = fs.readFileSync(locassetfile);
							dom.sandbox(curr_locfile.toString(), {}, function (jd) {
								locfilerel = 'file:' + jd.window.document.querySelector("asset_feature[feature='censhare:uuid']").getAttribute('value_string') + '.asset.xml';
							});
						};

						// dialog
						let d_uuid = uuid();
						widget.dialog_file = widget.dialog_file || name + '_dialog.xml';

						let d = asset({
								name: 'OC Management: ' + widget.name,
								type: 'module.dialog.'
							})
							.ins(asset_element())
							.ins(asset_feature({
								feature: 'censhare:resource-enabled',
								value_long: 1
							}))
							.ins(asset_feature({
								feature: 'censhare:resource-in-cached-tables',
								value_long: 1
							}))
							.ins(asset_feature({
								feature: 'censhare:resource-key',
								value_asset_key_ref: 'censhare:oc.dialog.widget-' + name.replace(/_/g, '.'),
								value_string: 'censhare:oc.dialog.widget-' + name.replace(/_/g, '.')
							}))
							.ins(asset_feature({
								feature: 'censhare:resource-meta'
							}, ['selection', {needed: false}]))
							.ins(asset_feature({
								feature: 'censhare:uuid',
								value_string: d_uuid
							}))
							.ins(asset_feature({
								feature: 'censhare:output-channel',
								value_key: data.channel
							}))
							.ins(child_asset_rel({
								key: 'user.localization.',
								child_asset_ref_file: locfilerel
							}, d_uuid + '.asset.xml'))		
							.ins(storage_item({
								mimetype: 'text/xml',
								relpath: 'file:' + d_uuid.substring(0, 8) +'_' + widget.dialog_file
							}))
						;
						saveFile('censhare/assets/' + name + '_dialog_asset.xml', d.outerHTML);

						// dialog storage item
						let ds = dialog(widget);
						saveFile('censhare/dialogs/' + name + '_dialog.xml', ds.outerHTML);

					});
					(data.extrafiles||[]).forEach(function (f) {
						
						let p2 = path.resolve(__dirname, '../../../', f);
						let s2_uuid = uuid();
						let [fullname, name, ext] = splitName(f);
						let s2 = asset({
								name: fullname,
								type: 'unknown.'
							})
							.ins(asset_element())
							.ins(asset_feature({
								feature: 'censhare:uuid',
								value_string: s2_uuid
							}))
							.ins(asset_feature({
								feature: 'censhare:output-channel',
								value_key: data.channel
							}))
							.ins(storage_item({
								mimetype: mimetypes[ext],
								relpath: 'file:' + s2_uuid.substring(0, 8) +'_' + fullname,
								original_path: p2
							}))
						;
						saveFile('censhare/assets/' + flatName(f) + '.asset.xml', s2.outerHTML);
					})
				}

			})
		}
	})
}

function splitName (name) {
	let [a, b, c] = /\/?([^\/]+)\.(.+)$/.exec(name);
	return [b + '.' + c, b, c.toLowerCase()];
}

function flatName (name) {
	return name.replace(/\/|\s/g, '_');
}

function saveFile (filepath, data) {
	filepath = path.resolve(__dirname, '../../..', filepath);
	if (!fs.existsSync(filepath)) {
		fs.mkdirSync(path.dirname(filepath), {recursive: true});
  		fs.writeFileSync(filepath, data);
  		console.log('Created "' + filepath + '".');
	}
}