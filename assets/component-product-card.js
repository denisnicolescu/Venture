if (typeof customElements.get('product-card') == 'undefined') {
	class ProductCard extends HTMLElement {
		constructor() {
			super();
		}

		connectedCallback() {
			this.selectInput = this.querySelector('select');
			this.quantityInput = this.querySelector('input[type="number"]');
			this.addToCartButton = this.querySelector('.product-card__add-to-cart');
			this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
			this.selectedVariants = {};
			
			this.init();
		}		

		init() {
			this.selectInput.addEventListener('change', this.onSelectChange.bind(this));
			this.quantityInput.addEventListener('change', this.onQuantityChange.bind(this));
			this.addToCartButton.addEventListener('click', this.addToCart.bind(this));

			this.checkStockStatus();
		}

		addToCart() {
			const variantId = this.selectedVariants.variant || this.selectInput.value;
			const quantity = this.selectedVariants.quantity || this.quantityInput.value;

			const config = fetchConfig('javascript');
			config.headers['X-Requested-With'] = 'XMLHttpRequest';
			delete config.headers['Content-Type'];

			const formData = new FormData();
			formData.append('id', variantId);
			formData.append('quantity', quantity);

			if (this.cart) {
				formData.append(
					'sections',
					this.cart.getSectionsToRender().map((section) => section.id)
				);
				formData.append('sections_url', window.location.pathname);
				this.cart.setActiveElement(document.activeElement);
			}

			config.body = formData;

			const fetchProduct = () => {
				return fetch(`${routes.cart_add_url}`, config)
					.then((response) => response.json())
					.then((data) => {
						return data;
					});
			};

			fetchProduct().then((data) => {
				this.cart.renderContents(data);
			});
		}

		checkStockStatus() {
			const selectedVariantId = this.selectInput.value;

			const isVariantInStock = !this.selectInput.querySelector(
				`option[value="${selectedVariantId}"][data-unavailable="true"]`
			);

			this.addToCartButton.disabled = !isVariantInStock;
			this.quantityInput.disabled = !isVariantInStock;
		}

		onSelectChange(event) {
			const variantId = event.target.value;
			this.selectedVariants.variant = variantId;

			this.checkStockStatus();
		}

		onQuantityChange(event) {
			const quantity = event.target.value;
			this.selectedVariants.quantity = quantity;
		}
	}
	customElements.define('product-card', ProductCard);
}
