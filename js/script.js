"use strict"


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
	function updateAnimationPosition() {
		if (!animation) return;

		const windowWidth = window.innerWidth;
		const activeLink = document.querySelector('.menu__link.active');

		if (windowWidth < 800 || !activeLink) {
			animation.classList.remove('show');
			return;
		}

		// Читаємо геометрію один раз
		const rect = activeLink.getBoundingClientRect();
		const headerRect = document.querySelector('header').getBoundingClientRect();
		const translateX = rect.left - headerRect.left - 5;
		const width = rect.width + 10;

		// Встановлюємо через requestAnimationFrame
		requestAnimationFrame(() => {
			animation.style.transform = `translateX(${translateX}px)`;
			animation.style.width = `${width}px`;
			animation.classList.add('show');
		});
	}

	//-------------------- Resize debounce --------------------
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			requestAnimationFrame(updateAnimationPosition);
		}, 150);
	});

	//-------------------- Click on menu links --------------------
	menuLinks.forEach(link => {
		link.addEventListener('click', () => {
			menuLinks.forEach(l => l.classList.remove('active'));
			link.classList.add('active');
			// Використовуємо requestAnimationFrame для плавності
			requestAnimationFrame(updateAnimationPosition);
		});
	});


	//-------------------- Hero Swiper --------------------
	window.addEventListener('load', () => {
		setTimeout(() => {
			const heroSwiper = new Swiper('.hero__swiper', {
				loop: true,
				autoplay: {
					delay: 7000,
					disableOnInteraction: false,
				},
				slidesPerView: 1,
				spaceBetween: 10,
				effect: 'fade',
				fadeEffect: { crossFade: true },
				preloadImages: false,
				lazy: { loadPrevNext: true },
				watchSlidesProgress: true,
				breakpoints: {
					640: { slidesPerView: 1, spaceBetween: 10 },
					1024: { slidesPerView: 1, spaceBetween: 10 },
				},
				on: {
					slideChangeTransitionStart() {
						updateActiveBg();
					},
				},
			});

			const heroBgs = document.querySelectorAll('.slide-hero__bg');

			function updateActiveBg() {
				heroBgs.forEach(bg => bg.classList.remove('active'));
				const activeSlide = heroSwiper.slides[heroSwiper.activeIndex];
				const activeBg = activeSlide.querySelector('.slide-hero__bg');
				if (activeBg) activeBg.classList.add('active');
			}

			updateActiveBg();
			setTimeout(updateAnimationPosition, 200);
		}, 150);
	});
});



//====================MOVE HEADER BUTTON TO BURGER MENU========================

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


//======================Swiper===================

document.addEventListener('DOMContentLoaded', () => {
	const swiperContainer = document.querySelector('.testimonials__swiper');
	if (!swiperContainer) return;

	// Створюємо observer для ініціалізації, коли секція потрапляє у viewport
	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				new Swiper(swiperContainer, {
					loop: true,
					autoplay: {
						delay: 5000,
						disableOnInteraction: false,
					},
					slidesPerView: 1,
					spaceBetween: 20,
					observer: true,
					observeParents: true,
				});
				obs.disconnect(); // Відключаємо після першої ініціалізації
			}
		});
	}, { threshold: 0.1 });

	observer.observe(swiperContainer);
});

//=====================footer spoiler==========

const titles = document.querySelectorAll('.item-navigation__title');

function handleSpoiler() {
	const isMobile = window.innerWidth <= 400;

	titles.forEach((title) => {
		const list = title.nextElementSibling;
		const arrow = title.querySelector('.nav-arrow');

		if (!list) return;

		// Видаляємо старі обробники перед додаванням нових, щоб не дублювати
		title.removeEventListener('click', toggleSpoiler);

		if (isMobile) {
			list.style.height = '0px';
			list.style.overflow = 'hidden';
			list.style.transition = 'height 0.3s ease-out';

			// Додаємо обробник тільки для мобільної версії
			title.addEventListener('click', toggleSpoiler);
		} else {
			// Для десктопа прибираємо стилі
			list.style.height = '';
			list.style.overflow = '';
			list.style.transition = '';
			title.classList.remove('active');
		}
	});
}

function toggleSpoiler(event) {
	const title = event.currentTarget;
	const list = title.nextElementSibling;

	if (!list) return;

	if (list.style.height === '0px' || list.style.height === '') {
		list.style.height = list.scrollHeight + 'px';
		title.classList.add('active');
	} else {
		list.style.height = '0px';
		title.classList.remove('active');
	}
}

// Викликаємо функцію при завантаженні сторінки та при зміні розміру з debounce
let resizeTimeout;
window.addEventListener('load', handleSpoiler);
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(handleSpoiler, 100);
});


//=========================animations on scroll=========================
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

observeElements('.item-support, .label, .title, .item-project, .item-blog,.item-project,.partners__item,.custom-block');
