"use strict";

document.addEventListener('DOMContentLoaded', () => {
	const html = document.documentElement;
	const body = document.body;
	const header = document.querySelector('.header');
	const menuIcons = document.querySelectorAll('.icon-menu');
	const menuLinks = document.querySelectorAll('.menu__link');
	const animation = document.querySelector('.animation');

	//-------------------- Loading --------------------
	requestAnimationFrame(() => {
		html.classList.remove('loading');
		html.classList.add('loaded');
	});

	//-------------------- Header scroll --------------------
	window.addEventListener('scroll', () => {
		header.classList.toggle('scrolled', window.scrollY > 50);
	});

	//-------------------- Menu toggle --------------------
	if (menuIcons.length) {
		menuIcons.forEach(icon => {
			icon.addEventListener('click', () => {
				icon.classList.toggle('active');
				body.classList.toggle('menu-open');
			});
		});
	}

	if (menuLinks.length) {
		menuLinks.forEach(link => {
			link.addEventListener('click', () => {
				body.classList.remove('menu-open');
				menuIcons.forEach(icon => icon.classList.remove('active'));
			});
		});
	}

	//-------------------- Active link animation --------------------
	//-------------------- Header animation --------------------
	function updateAnimationPosition() {
		const animation = document.querySelector('.animation');
		const activeLink = document.querySelector('.menu__link.active');
		if (!animation || !activeLink) return;

		const rect = activeLink.getBoundingClientRect();
		const headerRect = document.querySelector('header').getBoundingClientRect();
		const translateX = rect.left - headerRect.left - 5;
		const width = rect.width + 10;

		requestAnimationFrame(() => {
			animation.style.transform = `translateX(${translateX}px)`;
			animation.style.width = `${width}px`;
			animation.classList.add('show');
		});
	}

	//-------------------- Resize throttle --------------------
	let resizeTimeout;
	window.addEventListener('resize', () => {
		if (resizeTimeout) return;
		resizeTimeout = setTimeout(() => {
			requestAnimationFrame(updateAnimationPosition);
			resizeTimeout = null;
		}, 200);
	});

	//-------------------- Call after full page load --------------------
	window.addEventListener('load', () => {
		requestAnimationFrame(updateAnimationPosition);
	});

	//-------------------- Click on menu links --------------------
	menuLinks.forEach(link => {
		link.addEventListener('click', () => {
			menuLinks.forEach(l => l.classList.remove('active'));
			link.classList.add('active');
			requestAnimationFrame(updateAnimationPosition);
		});
	});
});

//==================== Hero Swiper ====================
document.addEventListener('DOMContentLoaded', () => {
	let heroSwiper;
	const heroBgs = document.querySelectorAll('.slide-hero__bg');

	function updateActiveBg() {
		if (!heroSwiper) return;
		heroBgs.forEach(bg => bg.classList.remove('active'));
		const activeSlide = heroSwiper.slides[heroSwiper.activeIndex];
		const activeBg = activeSlide.querySelector('.slide-hero__bg');
		if (activeBg) activeBg.classList.add('active');
	}

	window.addEventListener('load', () => {
		heroSwiper = new Swiper('.hero__swiper', {
			loop: true,
			autoplay: { delay: 5000, disableOnInteraction: false },
			slidesPerView: 1,
			spaceBetween: 10,
			effect: 'fade',
			fadeEffect: { crossFade: true },
			speed: 700, 
			preloadImages: false,
			lazy: { loadPrevNext: true },
			watchSlidesProgress: true,
			on: {
				slideChangeTransitionStart() {
					requestAnimationFrame(updateActiveBg);
				},
			},
		});
		updateActiveBg();
	});
});

//==================== MOVE HEADER BUTTON TO BURGER MENU ====================
document.addEventListener("DOMContentLoaded", function () {
	function moveElements() {
		const screenWidth = window.innerWidth;
		const elementsToMove = document.querySelectorAll("[data-da]");

		elementsToMove.forEach(function (element) {
			const data = element.getAttribute("data-da").split(",");
			if (data.length === 3) {
				const destinationSelector = data[0].trim();
				const order = parseInt(data[1].trim());
				const requiredScreenWidth = parseInt(data[2].trim());

				const destination = document.querySelector(destinationSelector);
				if (!destination) return;

				// Збереження початкового контейнера
				if (!element.dataset.originalParent) {
					const parent = element.parentNode;
					const index = Array.from(parent.children).indexOf(element);
					element.dataset.originalParent = parent.tagName.toLowerCase() + (parent.id ? `#${parent.id}` : '') + (parent.className ? `.${parent.className.replace(/\s+/g, '.')}` : '');
					element.dataset.originalIndex = index;
				}

				if (screenWidth <= requiredScreenWidth && !element.classList.contains("moved")) {
					// Переміщення в нове місце
					if (order === 1) {
						destination.insertBefore(element, destination.firstChild);
					} else {
						const previousElement = destination.children[order - 2];
						if (previousElement) {
							destination.insertBefore(element, previousElement.nextSibling);
						} else {
							destination.appendChild(element);
						}
					}
					element.classList.add("moved");
				} else if (screenWidth > requiredScreenWidth && element.classList.contains("moved")) {
					// Повернення на початкове місце
					const originalParentSelector = element.dataset.originalParent;
					const originalIndex = parseInt(element.dataset.originalIndex, 10);
					const originalParent = document.querySelector(originalParentSelector);

					if (originalParent) {
						const children = Array.from(originalParent.children);
						if (originalIndex < children.length) {
							originalParent.insertBefore(element, children[originalIndex]);
						} else {
							originalParent.appendChild(element);
						}
						element.classList.remove("moved");
					}
				}
			}
		});
	}

	moveElements();

	window.addEventListener("resize", function () {
		moveElements();
	});
});

//==================== Testimonials Swiper ====================
document.addEventListener('DOMContentLoaded', () => {
	const swiperContainer = document.querySelector('.testimonials__swiper');
	if (!swiperContainer) return;

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				new Swiper(swiperContainer, {
					loop: true,
					autoplay: { delay: 5000, disableOnInteraction: false },
					slidesPerView: 1,
					spaceBetween: 20,
					observer: true,
					observeParents: true,
				});
				obs.disconnect();
			}
		});
	}, { threshold: 0.1 });

	observer.observe(swiperContainer);
});

//==================== Footer Spoiler ====================
const titles = document.querySelectorAll('.item-navigation__title');

function handleSpoiler() {
	const isMobile = window.innerWidth <= 400;

	titles.forEach((title) => {
		const list = title.nextElementSibling;
		if (!list) return;

		title.removeEventListener('click', toggleSpoiler);

		if (isMobile) {
			title.addEventListener('click', toggleSpoiler);
		} else {
			title.classList.remove('active');
			list.classList.remove('active');
		}
	});
}

function toggleSpoiler(event) {
	const title = event.currentTarget;
	const list = title.nextElementSibling;
	if (!list) return;
	title.classList.toggle('active');
	list.classList.toggle('active');
}

let footerResizeTimeout;
window.addEventListener('load', handleSpoiler);
window.addEventListener('resize', () => {
	clearTimeout(footerResizeTimeout);
	footerResizeTimeout = setTimeout(handleSpoiler, 150);
});

//==================== Animations on Scroll ====================
const observeElements = (selectors, options = { threshold: 0.3, unobserve: true }) => {
	const elements = document.querySelectorAll(selectors);
	if (!elements.length) return;

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				if (options.unobserve) observer.unobserve(entry.target);
			}
		});
	}, options);

	elements.forEach(el => observer.observe(el));
};

observeElements('.item-support, .label, .title, .item-project, .item-blog, .partners__item, .custom-block');
