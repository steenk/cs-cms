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

function widgetitem (data) {
	let comp = ['widget', {
		version: 1
	}]
	comp.push(['componentreference', {id: data.name}]);
	let params = ['parameters'];
	Object.keys(data.parameters).forEach(function (key) {
		if (javaclass[data.parameters[key]] || (data.parameters[key].type && javaclass[data.parameters[key].type])) {
			params.push(['parameter', {
				name: key,
				export: "READWRITE",
				access: "READWRITE",
				type: javaclass[data.parameters[key]] || javaclass[data.parameters[key].type]
			}])
		}
	});
	comp.push(params);
	comp.push(['loaderreferences']);
	return $$$(comp);
}

module.exports = {widgetitem}