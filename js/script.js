"use strict"


function handlePageLoad() {
	const html = document.documentElement;

	document.addEventListener('DOMContentLoaded', () => {
		requestAnimationFrame(() => {
			html.classList.remove('loading');
			html.classList.add('loaded');
		});
	});
}

handlePageLoad();

//====================================
document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
	const menuIcons = document.querySelectorAll(".icon-menu");
	const menuLinks = document.querySelectorAll(".menu__link");

	if (menuIcons.length > 0) {
		menuIcons.forEach(icon => {
			icon.addEventListener("click", () => {
				icon.classList.toggle("active");
				body.classList.toggle("menu-open");
			});
		});
	}

	if (menuLinks.length > 0) {
		menuLinks.forEach(link => {
			link.addEventListener("click", () => {
				body.classList.remove("menu-open");
				menuIcons.forEach(icon => icon.classList.remove("active"));
			});
		});
	}
});



window.addEventListener('scroll', () => {
	const header = document.querySelector('.header');
	if (window.scrollY > 50) {
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const animation = document.querySelector('.animation');

	function updateAnimationPosition() {
		const windowWidth = window.innerWidth;
		const activeLink = document.querySelector('.menu__link.active');

		if (windowWidth >= 800) {
			if (activeLink) {
				const rect = activeLink.getBoundingClientRect();
				const headerRect = document.querySelector('header').getBoundingClientRect();

				// Використовуємо requestAnimationFrame для плавного оновлення позиції
				requestAnimationFrame(() => {
					animation.style.left = `${rect.left - headerRect.left - 5}px`;
					animation.style.width = `${rect.width + 10}px`;
					animation.classList.add('show');
				});
			} else {
				animation.classList.remove('show');
			}
		} else {
			animation.classList.remove('show');
		}
	}

	// Оновлюємо позицію після завантаження всіх ресурсів
	window.addEventListener('load', () => {
		setTimeout(updateAnimationPosition, 200); // Збільшена затримка для повного завантаження стилів та ресурсів
	});

	// Оновлюємо позицію при зміні розміру вікна
	window.addEventListener('resize', () => {
		requestAnimationFrame(updateAnimationPosition);
	});

	// Динамічне перемикання активного пункту меню
	document.querySelectorAll('.menu__link').forEach(link => {
		link.addEventListener('click', () => {
			document.querySelectorAll('.menu__link').forEach(l => l.classList.remove('active'));
			link.classList.add('active');

			// Використовуємо тайм-аут для коректного оновлення анімації
			setTimeout(updateAnimationPosition, 50);
		});
	});
});

const heroSwiper = new Swiper('.hero__swiper', {
	loop: true, // Зациклення слайдів
	autoplay: {
		delay: 7000, // Час між слайдами
	},
	spaceBetween: 10,
	slidesPerView: 1,
	effect: 'fade', // Плавна зміна слайдів
	fadeEffect: {
		crossFade: true,
	},
	breakpoints: {
		640: {
			slidesPerView: 1,
			spaceBetween: 10,
		},
		1024: {
			slidesPerView: 1,
			spaceBetween: 10,
		},
	},
	on: {
		resize() {
			this.update(); // Оновлення при зміні розміру екрана
		}
	}
});

// Отримуємо всі фони слайдів один раз
const heroBgs = document.querySelectorAll('.slide-hero__bg');

// Функція для оновлення активного фону
function updateActiveBg() {
	heroBgs.forEach(bg => bg.classList.remove('active'));
	const activeSlide = heroSwiper.slides[heroSwiper.activeIndex];
	const activeBg = activeSlide.querySelector('.slide-hero__bg');
	if (activeBg) activeBg.classList.add('active');
}

// Додаємо слухача на зміну слайда
heroSwiper.on('slideChangeTransitionStart', updateActiveBg);

// Активуємо перший фон при старті
if (heroBgs[heroSwiper.activeIndex]) {
	heroBgs[heroSwiper.activeIndex].classList.add('active');
}





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

	const testimonialsSwiper = new Swiper(swiperContainer, {
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
});


//=====================footer spoiler==========

const titles = document.querySelectorAll('.item-navigation__title');

function handleSpoiler() {
	if (window.innerWidth <= 400) {
		titles.forEach((title) => {
			const list = title.nextElementSibling;
			const arrow = title.querySelector('.nav-arrow');

			if (list) {
				list.style.height = '0px';
				list.style.overflow = 'hidden';
				list.style.transition = 'height 0.3s ease-out';

				// Видаляємо старі обробники перед додаванням нових
				title.removeEventListener('click', toggleSpoiler);
				title.addEventListener('click', toggleSpoiler);
			}
		});
	} else {
		// Якщо ширина більше 600px, прибираємо inline-стилі та обробники подій
		titles.forEach((title) => {
			const list = title.nextElementSibling;
			if (list) {
				list.style.height = '';
				list.style.overflow = '';
				list.style.transition = '';
				title.removeEventListener('click', toggleSpoiler);
			}
		});
	}
}

function toggleSpoiler(event) {
	const title = event.currentTarget;
	const list = title.nextElementSibling;

	if (list.style.height === '0px' || list.style.height === '') {
		list.style.height = list.scrollHeight + 'px';
		title.classList.add('active');
	} else {
		list.style.height = '0px';
		title.classList.remove('active');
	}
}

// Викликаємо функцію при завантаженні сторінки та при зміні розміру
window.addEventListener('load', handleSpoiler);
window.addEventListener('resize', handleSpoiler);

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
