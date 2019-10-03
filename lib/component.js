const $$$ = require('tripledollar');

const javaclass = {
	string: 'java.lang.String',
	integer: 'java.lang.Integer',
	'parameter-list-input': 'java.util.List&lt;java.lang.String&gt;',
	relation: 'com.censhare.model.corpus.impl.Asset',
	'parameter-select': 'java.lang.String',
	boolean: 'java.lang.Boolean',
	'parameter-boolean': 'java.lang.Boolean'
}

function component (widget) {
	let name = widget.skin_file || widget.name.toLowerCase().replace(/ /g, '_') + '.ftl';
	let comp = ['component', {
		class: widget.javaclass || 'com.censhare.oc.system.component.rendering.SkinnableComponent',
		version: 1
	}]
	let params = ['parameters', ['parameter', {
		name: "skin",
		export: "READWRITE",
		access: "READWRITE",
		type: "java.lang.String"
	}, ['scalar', {
		class: "java.lang.String"
	}, name]]];
	Object.keys(widget.parameters).forEach(function (key) {
		if (javaclass[widget.parameters[key].type]) {
			params.push(['parameter', {
				name: key,
				export: "READWRITE",
				access: "READWRITE",
				type: javaclass[widget.parameters[key].type]
			}])
		}
	});
	comp.push(params);
	comp.push(['wires']);
	return $$$(comp);
}

module.exports = {component}