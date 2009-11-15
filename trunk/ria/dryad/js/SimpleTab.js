// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * SimpleTab
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-09-09
 * @link   http://www.garcecode.com/
 */
~function() {
	var defaultConfig = {
		effect: 'none',
		eventType: 'click',
		stopEvent: true,
		currentClass: 'selected',
        autoSwitch: true,
        duration: 500
	};
	var SimpleTab = new Class({
		initialize: function(container, config) {
			container = $(container);
			config = $merge(defaultConfig, config);

			var children = container.getChildren();
			var triggers = $$(children[0].getElementsByTagName('li'));
			var panels = $$(children.slice(1));

			var _self = this;
			triggers.addEvent('click', function(e) {
				var index = triggers.indexOf(this);
				_self.switchTo(index);
			});

			this.triggers = triggers;
			this.panels = panels;
			this.config = config;

            if (config.autoSwitch) {
                this.switchTo(0);
            }
		},

		switchTo: function(index) {
			if (this.panels[index] && this.triggers[index] && (this.currentIndex != index)) {
				var panel = this.panels[index], trigger = this.triggers[index], config = this.config;
                this.currentIndex = index;

				this.triggers.removeClass(config.currentClass);
				trigger.addClass(config.currentClass);

				this.panels.setStyle('display', 'none');

				if (config.effect == 'opacity') {
					panel.setStyle('opacity', '0');
				}

				panel.setStyle('display', '');

				if (config.effect == 'opacity') {
					new Fx.Morph(panel, {
						duration: config.duration
					}).start({
						'opacity': [0, 1]
					});
				}

				if (config.onSwitch) {
					config.onSwitch.bind(this, arguments)();
				}
			}
		}
	});

    window.SimpleTab = SimpleTab;
} ();
