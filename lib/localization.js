const $$$ = require('tripledollar');

function localization (widget) {
	let loc = ['localization', {'std-version':2.3},
		['properties', {locale: ''},
			['entry', {key: 'group.settings'}, 'Settings'],
			['entry', {key: 'label.title'}, 'Title']
		],
		['properties', {locale: 'sv'},
			['entry', {key: 'group.settings'}, 'Inställningar'],
			['entry', {key: 'label.title'}, 'Titel']
		]
	];

	return $$$(loc);
}

module.exports = {localization};