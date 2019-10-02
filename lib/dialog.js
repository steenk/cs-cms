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
    		heading: "controller.translate('group.settings')"
    	}];
    	Object.keys(widget.parameters).forEach(function (key) {
            let paramtype = typeof widget.parameters[key] === 'object' ? widget.parameters[key].type : 'string';
            if (paramtype) {
                let struct = widgetType[paramtype](widget, key);
                settings.push(struct);
            }
    	});
        dia.push(settings);
	}

	return $$$(dia);
}

function optionList (params) {
    let list = params.list || [];
    var out = [];
    list.forEach((val) => {
        out.push("{'value':'" + val + "', 'display_value':controller.translate('label." + val + "')}");
    })
    return '[' + out.join(',') + ']';
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
    'parameter-list-input': function (widget, key) {
        let attr = {
            type: widget.parameters[key].valuetype || 'text',
            parameter: "controller.getParameter('" + key + "')"
        }
        if (widget.placeholder) {
            attr.placeholder = widget.placeholder;
        }      
        return ['cs-oc-widget-parameter-list-input', attr];
    },
    relation: function (widget, key) {
        let attr = {
            'relation-title': "controller.translate('label." + key + "')",
            'relation-type': "user.content.",
            relation: "controller.getContentAssetController()"
        }
        if (widget.parameters[key].assettype) {
            attr.filter = "{ assettype: '" + widget.parameters[key].assettype + "' }"
        }
        return ['cs-oc-widget-relation', attr]
    },
    'sorted-relation': function (widget, key) {
        let attr = {
            'relation-title': "controller.translate('label." + key + "')",
            'relation-type': "user.content.",
            relation: "controller.getContentAssetController()"
        }
        if (widget.parameters[key].assettype) {
            attr.filter = "{ assettype: '" + widget.parameters[key].assettype + "' }"
        }
        return ['cs-oc-widget-sorted-relation', attr]
    },
    'parameter-select': function (widget, key) {
        let attr = {
            options: optionList(widget.parameters[key]),
            parameter: "controller.getParameter('" + key + "')"
        }
        return ['cs-oc-widget-parameter-select', attr];
    }
}

module.exports = {dialog}