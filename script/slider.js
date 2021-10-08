class Slider {
    constructor(selector, oneSlideTime, navigationEnabled) {
        this.selector = selector;
        this.slideTime = oneSlideTime;
        this.navigationEnabled = navigationEnabled || false;
        this.activeSlide = 0;
        this.inAnimation = false;
    }

    init() {
        this.getElements();
        this.bindEvents();
        this.initialize()
    }


    getElements() {
        this.container = document.querySelector(this.selector);
        this.wrapper = this.container.querySelector(".slider__wrapper");
    }

    bindEvents() {
        this.container.addEventListener('click', e => {
            if (e.target.matches(".slider__span")) this.onSlideSelected(e.target.dataset.target);
            if (e.target.matches(".slider__arrow_left")) this.prevSlide();
            if (e.target.matches(".slider__arrow_right")) this.nextSlide();
        })
    }

    initialize() {
        this.slideCount = this.wrapper.querySelectorAll(".slider__slide").length;
        if (this.navigationEnabled) this.createNavigation();
    }

    createNavigation() {
        this.navigator = document.createElement('div');
        this.navigator.classList.add('slider__navigation');

        for (let i = 0; i < this.slideCount; i++) {
            let navigationSpan = document.createElement('span')
            navigationSpan.classList.add('slider__span');
            navigationSpan.dataset.target = i.toString();
            if (i === this.activeSlide) {
                navigationSpan.classList.add('slider__span_active');
            }
            this.navigator.append(navigationSpan);
        }

        this.container.append(this.navigator);
    }

    /**
     * Внутрений метод анимации на следующий слайд
     * @param onComplete - вызываеться по концу анимации
     * @param quick - ускоренный режим
     * @private
     */
    _nextSlide(onComplete, quick) {
        let time = quick ? this.slideTime / this.slideCount : this.slideTime;
        this.animate(
            time,
            s => {
                this.wrapper.style.marginLeft = -s.score + '%';
            },
            () => {
                this.wrapper.append(this.wrapper.firstElementChild)
                this.wrapper.style.marginLeft = 'auto';
                this.markActive(this.activeSlide < this.slideCount - 1 ? this.activeSlide + 1 : 0);
                if (onComplete) onComplete();
            }
        )
    }

    /**
     * Внутрений метод анимации на предидущий слайд
     * @param onComplete - вызываеться по концу анимации
     * @param quick - ускоренный режим
     * @private
     */
    _prevSlide(onComplete, quick) {
        let time = quick ? this.slideTime / this.slideCount : this.slideTime;

        this.wrapper.prepend(this.wrapper.lastElementChild);
        this.wrapper.style.marginLeft = '-100%';
        this.animate(
            time,
            s => {
                this.wrapper.style.marginLeft = -(100 - s.score) + '%';
            },
            () => {
                this.wrapper.style.marginLeft = 'auto';
                this.markActive(this.activeSlide > 0 ? this.activeSlide - 1 : this.slideCount - 1);
                if (onComplete) onComplete();
            }
        )
    }

    nextSlide() {
        if (this.inAnimation) return;
        this.inAnimation = true;
        this._nextSlide(() => this.inAnimation = false);
    }

    prevSlide() {
        if (this.inAnimation) return;
        this.inAnimation = true;
        this._prevSlide(() => this.inAnimation = false);
    }


    /**
     * Функция для анимирования
     * @param time - время анимации в ms
     * @param func - шаг анимации, вызываеться для отрисовки кадра
     * @param onAnimationEnd - вызывается по завершению анимации
     */
    animate(time, func, onAnimationEnd) {
        let state = { score: 0 };
        TweenLite.to(state, time / 1000, { score: 100, onUpdate: () => func(state), onComplete: () => onAnimationEnd() });
    }


    /**
     * Помечает указанный слайд как активный
     * @param newActiveSlide - номер нового активного слайда
     */
    markActive(newActiveSlide) {
        this.navigator.children[this.activeSlide].classList.remove('slider__span_active');
        this.activeSlide = newActiveSlide;
        if (this.navigator) {
            this.navigator.children[this.activeSlide].classList.add('slider__span_active');
        }
    }

    onSlideSelected(slideNumber) {
        if (this.inAnimation) return;
        this.inAnimation = true;
        let animFunc = () => {
            if (this.activeSlide < slideNumber) this._nextSlide(() => animFunc(), true);
            else if (this.activeSlide > slideNumber) this._prevSlide(() => animFunc(), true);
            else this.inAnimation = false;
        }

        animFunc();
    }
}
let slider = new Slider(".page-slider-one", 1000, true);
document.addEventListener("DOMContentLoaded", () => slider.init());