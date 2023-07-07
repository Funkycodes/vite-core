import AutoBind from "auto-bind";
import Prefix from "prefix";
import NormalizeWheel from "normalize-wheel";
import Title from "../animations/Title";
import Paragraph from "../animations/Paragraph";
import { clamp, lerp } from "../utils/math";
import { map } from "lodash";

export default class Page {
  constructor({ selector, selectors, classes }) {
    AutoBind(this);
    this.selector = selector;
    this.selectorChildren = { ...selectors, animatedTitles: "[data-animation='title']", animatedParagraphs: "[data-animation='paragraph']" };
    this.classes = { ...classes };

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };

    this.init();
    this.transformPrefix = Prefix("transform");
  }

  init() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    this.elements = {};
    for (let [key, value] of Object.entries(this.selectorChildren)) {
      if (
        value instanceof HTMLElement ||
        value instanceof NodeList ||
        Array.isArray(value)
      ) {
        this.elements[key] = value;
      } else {
        this.elements[key] = this.element.querySelectorAll(value);

        if (this.elements[key].length === 1) { this.elements[key] = this.element.querySelector(value); }
        else if (this.elements[key].length === 0) {
          this.elements[key] = null;
        }
      }
    }
    this.createAnimations()
  }

  createAnimations() {
    this.animatedTitles = map(this.elements.animatedTitles, element => new Title({ element }))
    this.animatedParagraphs = map(this.elements.animatedParagraphs, element => new Paragraph({ element }))

    console.log(this.animatedParagraphs, this.animatedTitles)
  }

  transform(target, amount) {
    target.style[this.transformPrefix] = `translate3d(0, -${Math.round(
      amount
    )}px, 0)`;
  }

  show() {
    this.scroll.position = 0;
    this.scroll.current = 0;
    this.scroll.target = 0;

    return Promise.resolve();
  }
  hide() {
    return Promise.resolve();
  }

  /**
   * Event Callbacks
   */

  onResize() {
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
  }

  onWheel(e) {
    const normalizedWheel = NormalizeWheel(e);
    const speed = normalizedWheel.pixelY;
    this.scroll.target += speed;
  }

  onTouchStart(e) {
    this.isTouching = true;

    this.scroll.position = this.scroll.current;
    this.startPos = e.touches ? e.touches[0].clientY : e.clientY;
    console.log(this.startPos);
  }
  onTouchMove(e) {
    if (!this.isTouching) return;

    this.endPos = e.touches ? e.touches[0].clientY : e.clientY;
    const displacement =
      (this.startPos - this.endPos) * 2; /* Touch multiplier */
    this.scroll.target = this.scroll.position + displacement;
  }
  onTouchEnd() {
    this.isTouching = false;
  }

  /**
   * update
   */

  update() {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    const { current, target, ease } = this.scroll;
    this.scroll.current = lerp(current, target, ease);

    this.transform(this.elements.wrapper, this.scroll.current);
  }
}
