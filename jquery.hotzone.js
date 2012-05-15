/**
* jQuery Hotzone - v0.1 5/14/2012
* 
* jQuery plugin for defining spacial zones of importance,
* attaching events, and providing callbacks
*
* Copyright (c) 2012 Ryan LaBouve (@ryanlabouve)
* Dual licensed under the MIT and GPL licenses.
*
*/
;(function($, window, undefined) {
	$.widget("rl.hotzone", {
		options: {
			eventNamespace: "hotzone",
			eventMatrix: ["click"],
			originalHeight: 0,
			originalWidth: 0,
			adjustedHeight: undefined,
			adjustedWidth: undefined,
			hotSpots: []
		},
		_create: function() {
			var self = this;

			self._refresh_adjusted_dimensions();
			$(window).resize(function() {
				self._refresh_adjusted_dimensions();
			});

			self.element.on(self.options.eventMatrix.join(" "), function(e) {
				
				var event_coord = { x: e.offsetX, y: e.offsetY };
				
				$.each(self.options.hotSpots, function(key, val){
					if( self._is_in_range(val, event_coord)) {
						val.callback();
					}
				});
			});
		},
		_refresh_adjusted_dimensions: function() {
			var self = this;
			self.options.adjustedWidth = self.element.width();
			self.options.adjustedHeight = self.element.height();
		},
		newHotSpot: function(hs) {
			this.options.hotSpots.push({
				name: hs.name,
				x1: hs.a.x,
				y1: hs.a.y,
				x2: hs.b.x,
				y2: hs.b.y,
				callback: hs.callback
			});
		},
		_is_in_range: function(hotspot, event_coord) {
			var self = this;
			//TODO Optimize this by caching

			//perform transform on hotspot
			var factor_x = self.options.adjustedWidth / self.options.originalWidth;
			var factor_y = self.options.adjustedHeight / self.options.originalHeight;
			
			var skew_x1 = hotspot.x1 * factor_x;
			var skew_y1 = hotspot.y1 * factor_y;
			var skew_x2 = hotspot.x2 * factor_x;
			var skew_y2 = hotspot.y2 * factor_y;

			// for debuging skewing issues
			// console.log("skew x1,y1: " + skew_x1 + "," + skew_y1);
			// console.log("skew x2,y2: " + skew_x2 + "," + skew_y2);
			
			//check if event is in range
			if( ( event_coord.x >= skew_x1 && event_coord.x <= skew_x2 ) &&
					( event_coord.y >= skew_y1 && event_coord.y <= skew_y2) ) {
				return true;
			} else {
				return false;
			}
		},
		_setOption: function(key, value) {
			switch(key) {
				case "eventMatrix":
					console.log("Changing event matrix");
					break;
				case "eventNamespace":
					console.log("Changing event matrix");
					break;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		_destroy: function() {
			// TODO: Properly destroy plugin
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery, window);