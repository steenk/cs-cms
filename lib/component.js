const $$$ = require('tripledollar');

const javaclass = {
	string: "java.lang.String"
}

function component (widget) {
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
	}, widget.name]]];
	Object.keys(widget.parameters).forEach(function (key) {
		params.push(['parameter', {
			name: key,
			export: "READWRITE",
			access: "READWRITE",
			type: javaclass[widget.parameters[key]]
		}])
	});
	comp.push(params);
	comp.push(['wires']);
	return $$$(comp);
}

module.exports = {component}