const $$$ = require('tripledollar');

function dialog (widget) {
	let dia = ['cs-oc-widget-dialog'];
	// labels
	dia.push(['cs-oc-widget-field-group', {
		heading: "controller.translate('group.labels')",
		'ng-if': 'controller.getLabelController().getLabels().length'
	}, ['cs-oc-widget-label'], {
		parameter: "controller.getLabelController()"
	}]);
	// targeting
	dia.push(['cs-oc-widget-field-group', {
		heading: "controller.translate('group.targeting')"
	}, ['cs-oc-widget-targeting', {
		'targeting-available-rules': "controller.targetingRules.availableRules",
        'targeting-rules': "controller.targetingRules.rules",
        'targeting-exclude-rules': "controller.targetingRules.excludeRules",
        'targeting-api': "controller.targetingRules.api"
    }]]);
    // output-channels
    dia.push(['cs-oc-widget-field-group', {
    	heading: "controller.translate('group.output-channels')"
    }, ['cs-oc-widget-feature-multiple', {
    	parameter: "controller.getChannelController()"
    }]]);
    // settings
    if (widget.parameters) {
    	let settings = ['cs-oc-widget-field-group', {
    		heading: "controller.translate('group.output-channels')"
    	}];
    	Object.keys(widget.parameters).forEach(function (key) {
    		settings.push(['cs-oc-widget-parameter-input', { 
              type: widget.parameters[key],
              parameter: "controller.getParameter('" + key + "')"
    		}]);
    		dia.push(settings);
    	});
	}

	return $$$(dia);
}


module.exports = {dialog}