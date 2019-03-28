const $$$ = require('tripledollar');

const javaclass = {
	string: "java.lang.String",
	boolean: "java.lang.Boolean",
	integer: "java.lang.Integer"
}

function widgetitem (data) {
	let comp = ['widget', {
		version: 1
	}]
	comp.push(['cxomponentreference', {id: data.name}]);
	let params = ['parameters'];
	Object.keys(data.parameters).forEach(function (key) {
		params.push(['parameter', {
			name: key,
			export: "READWRITE",
			access: "READWRITE",
			type: javaclass[data.parameters[key]]
		}])
	});
	comp.push(params);
	comp.push(['loaderreferences']);
	return $$$(comp);
}

module.exports = {widgetitem}