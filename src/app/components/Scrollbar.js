import Scroller from "./Scroller";
import { lerp } from "../utils/math";
import Component from "../classes/Component";

export default class extends Component {
  constructor () {
    super({
      element: ".c-scrollbar",
      elements: {
        inner: ".c-scrollbar__inner",
        thumb: ".c-scrollbar__thumb"
      }
    });
    this.scroller = new Scroller({});

    this.opacity = {
      current: 0,
      target: 0,
    };
    this.id;
    this.init();
  }

  init() {
    this.scroller.scrollTo(0, 0);

    this.scrollElement = document.querySelector(".pages > .is-active");
    document.body.style.height = `${this.scrollElement.getBoundingClientRect().height}px`;

    this.element.onmouseenter = () => {
      this.opacity.target = 1;
      this.mouseover = true;
    };

    this.element.onmouseleave = () => {
      this.opacity.target = 0;
      this.mouseover = false;
    };
  }

  onScroll() {
    this.isScrolling = true;
    this.elements.thumb.style.transform = `translate3d(0, ${this.scroller.progress * (this.elements.inner.getBoundingClientRect().height - this.elements.thumb.getBoundingClientRect().height)}px, 0)`;
    this.opacity.target = 1;
  }

  update() {
    if (!this.isScrolling && this.opacity.target === this.opacity.current && !this.mouseover) {
      if (this.id) clearTimeout(this.id);
      else
        this.id = setTimeout(() => {
          this.opacity.target = 0;
          console.log("we set it");
        }, 1500);
    }
    else if (this.id && (this.isScrolling || this.mouseover))
      clearTimeout(this.id);

    if (Math.abs(this.opacity.target - this.opacity.current) <= 0.1)
      this.opacity.current = this.opacity.target;

    this.opacity.current = lerp(
      this.opacity.current,
      this.opacity.target,
      0.1);
    this.element.style.setProperty("opacity", this.opacity.current);

    if (this.opacity.current == this.opacity.target) {
      this.isScrolling = false;
      // console.log(this.opacity);
    }
  }
}