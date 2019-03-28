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
            let paramtype = typeof widget.parameters[key] === 'object' ? widget.parameters[key].type : widget.parameters[key];
            if (paramtype) {
                let struct = widget.parameters[key](widget, key);
                settings.push(struct);
                dia.push(settings);
            }
    	});
	}

	return $$$(dia);
}

const widgetType = {
    string: function (widget, key) {
        let attr = {
            type: 'text',
            parameter: "controller.getParameter('" + key + "')"
        }
        if (widget.placeholder) {
            attr.placeholder = widget.placeholder;
        }      
        return ['cs-oc-widget-parameter-input', attr];

    },
    boolean: function (widget, key) {
        return ['cs-oc-widget-parameter-boolean', {
            parameter: "controller.getParameter('" + key + "')"
        }];
    },
    integer: function (widget, key) {
        let attr = {
            type: 'number',
            parameter: "controller.getParameter('" + key + "')"
        }
        if (widget.placeholder) {
            attr.placeholder = widget.placeholder;
        }      
        return ['cs-oc-widget-parameter-input', attr];
    },
    relation: function (widget, key) {
        let attr = {
            'relation-title': "controller.translate('label." + key + "')",
            relation: "controller.getContentAssetController()"
        }
        if (widget.parameters[key].assettype) {
            attr.filter = "{ assettype: '" + widget.parameters[key].assettype + "' }"
        }
        return ['cs-oc-widget-relation', attr]
    }
}

module.exports = {dialog}