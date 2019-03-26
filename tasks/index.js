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
				const {asset, asset_feature, storage_item, asset_element} = require('../lib/asset');
				const {dialog} = require('../lib/dialog');
				const {component} = require('../lib/component');
				const {widgetitem} = require('../lib/widget');
				const {fmmacro} = require('../lib/fmmacro');
				const {localization} = require('../lib/localization');

				setup(data);

				function setup (data) {

					data.widgets.forEach(function (widget) {
						let name = widget.name.toLowerCase().replace(' ', '_');
						let s_uuid = uuid();

						// skin
						widget.skin_file = widget.skin_file || name + '.ftl';
						let s = asset({
								name: widget.name,
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
								relpath: 'file:' + s_uuid.substring(0, 8) +'_' + widget.skin_file
							}))
						;
						saveFile('censhare/assets/' + name + '_skin_asset.xml', s.outerHTML);

						// freemarker storage item
						let fmm = fmmacro(widget);
						saveFile('templates/' + name + '.ftl', fmm);

						// component
						let c_uuid = uuid();
						widget.component_file = widget.component_file || name + '._component.xml';

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
								mimetype: 'application/xml',
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
								value_asset_key_ref: 'censhare:oc.dialog.widget-' + name.replace('_', '.'),
								value_string2: 'censhare:resource-key'
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
								mimetype: 'application/xml',
								relpath: 'file:' + w_uuid.substring(0, 8) +'_' + widget.widget_file
							}))
						;
						saveFile('censhare/assets/' + name + '_widget_asset.xml', w.outerHTML);

						// widget storage item
						let wsi = widgetitem(widget);
						saveFile('censhare/widgets/' + name + '_widget.xml', wsi.outerHTML);

						// dialog location
						let locfile = path.resolve(__dirname, '../../../censhare/dialogs/' + (data.prefix||'common') + '_localization.xml');
						if (!fs.existsSync(locfile)) {
							let loc_uuid = uuid();
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
								mimetype: 'application/xml',
								relpath: 'file:' + loc_uuid.substring(0, 8) + '_' + (data.prefix||'common') + 'localization.xml'
							}));
							let loccontent = localization(widget);
							saveFile('censhare/dialogs/' + (data.prefix||'common') + '_localization.xml', loccontent.outerHTML);
							saveFile('censhare/assets/' + (data.prefix||'common') + '_dialog_localization_asset.xml', loc.outerHTML);
						}

						// dialog
						let d_uuid = uuid();
						widget.widget_file = widget.widget_file || name + '_dialog.xml';

						let d = asset({
								name: widget.name,
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
								value_asset_key_ref: 'censhare:oc.dialog.widget-' + name.replace('_', '.'),
								value_string2: 'censhare:oc.dialog.widget-' + name.replace('_', '.')
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
							.ins(storage_item({
								mimetype: 'application/xml',
								relpath: 'file:' + d_uuid.substring(0, 8) +'_' + widget.dialog_file
							}))
						;
						saveFile('censhare/assets/' + name + '_dialog_asset.xml', d.outerHTML);

						// dialog storage item
						let ds = dialog(widget);
						saveFile('censhare/dialogs/' + name + '_dialog.xml', ds.outerHTML);

					})
				}

			})
		}
	})
}

function saveFile (filepath, data) {
	filepath = path.resolve(__dirname, '../../..', filepath);
	if (!fs.existsSync(filepath)) {
		fs.mkdirSync(path.dirname(filepath), {recursive: true});
  		fs.writeFileSync(filepath, data);
  		console.log('Created "' + filepath + '".');
	}
}