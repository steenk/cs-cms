
function fmmacro (widget) {
	let name = widget.name.toLowerCase().replace(' ', '_');
	let m = elem_start('#macro ' + name);
	m += '\n\t';
	m += elem_start('div', {class: name});
	m += '\n';
	Object.keys(widget.parameters).forEach(function (key) {
		m += '\t\t';
		m += elem_start('h1');
		m += "${cs.@" + key + "}";
		m += elem_end('h1')
		m += '\n';
	});
	m += '\t';
	m += elem_end('div');
	m += '\n';
	m += elem_end('#macro');
	m += elem_start('@' + name);
	return m;
}

function elem_start (name, attr) {
	let el = '<' + name;
	if (attr) {
		Object.keys(attr).forEach(function (key) {
			el += ' ' + key + '="' + attr[key] + '"';
		})
	}
	el += '>';
	return el;
}

function elem_end (name) {
	return '</' + name + '>'; 
}

module.exports = {fmmacro}