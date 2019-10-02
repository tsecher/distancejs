const $ = jQuery;

export class DistanceOrigin {

	constructor($origin, options) {
		if (!DistanceOrigin.allOrigins) {
			DistanceOrigin.allOrigins = [];
		}

		this.options = options;
		this.$origin = $origin;
		this.items = [];
		this.stock();

		this.init();

		if( this.options.auto ){
			$(window).resize(()=>{
				window.clearTimeout(this.timeout)
				this.timeout = window.setTimeout(() => this.init(), 100)
			});
		}
	}

	init() {
		console.log("--init")
		if (typeof (this.options.onDistanceChange) == 'function') {
			this.initDistance(this.options.onDistanceChange)
		}
	}

	stock() {
		if (this.$origin.attr('data-distance-origin').length < 1) {
			this.id = Math.random(0, 100)
			this.$origin.attr('data-distance-origin', this.id)
			DistanceOrigin.allOrigins.push(this)
		}
		else{
			this.id = this.$origin.attr('data-distance-origin')
		}
	}

	initDistance(callback) {
		this.items = [];
		this.$origin.find('[data-distance-item]').each((i, n) => {
			n = $(n);
			this.items.push({
				distance: this.getDistance(n),
				element: n
			})
		});

		// sort items.
		this.items.sort((a, b) => {
			if (a.distance < b.distance) {
				return -1
			}
			return 1;
		})

		// Init variable.
		const nbItems = this.items.length;
		for (let i = 0; i < nbItems; i++) {
			callback(this.items[i].element, i / nbItems, this.items[i].distance);
		}
	}

	getDistance($elem) {
		const elemOffset = $elem.offset();
		const originOffset = this.$origin.offset();
		const distance =
			Math.sqrt(
				(elemOffset.left - originOffset.left)
				* (elemOffset.top - originOffset.top));

		return distance;
	}

	static getOriginDataByElement($element) {
		if( DistanceOrigin.allOrigins ){
			return DistanceOrigin.allOrigins.filter(i => {
				i.id == $element.attr('data-distance-origin');
			})[0];
		}
		return null;

	}

	static create($origin, options) {
		return new DistanceOrigin($origin, options);
	}
}

/**
 * Ajout d'une méthode jQuery
 */
$.fn.extend({
	distance: function (options) {
		const distanceItem = DistanceOrigin.getOriginDataByElement(this);
		return distanceItem ? distanceItem : DistanceOrigin.create(this, options);
	}
})