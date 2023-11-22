if (typeof customElements.get('products-carousel') == 'undefined') {
	class ProductsCarousel extends HTMLElement {
		constructor() {
			super();

			this.uniqueClass = `.splide--${this.dataset.id}`;
			this.slider = this.querySelector('.splide');
			this.slides = this.slider.querySelectorAll('.splide__slide');
			this.autoplay = this.slider.dataset.autoplay;
			this.arrows = this.slider.dataset.arrows;

			this.init();
		}

		init() {
			this.initSlider();
		}

		initSlider() {
			if (this.slides.length < 2) return;

			const splide = new Splide(this.uniqueClass, {
				type: 'fade',
				perPage: 1,
				perMove: 1,
				drag: true,
				arrows: 'true',
				fade: true,
				lazyLoad: 'nearby',
				interval: 3000,
				rewind: true,
				pagination: false
			});

			splide.mount();
		}
	}
	customElements.define('products-carousel', ProductsCarousel);
}
