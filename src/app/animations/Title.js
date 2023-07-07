import Animation from "../classes/Animation"
import gsap from "gsap";

export default class Title extends Animation {
  constructor({
    element,
    elements
  }) {
    super({ element, elements });
    this.animateOut()
  }

  animateIn() {
    gsap.fromTo(this.element, {
      x: 10,
      autoAlpha: 0,
    }, {
      x: 0,
      autoAlpha: 1
    })
  }
  animateOut() {
    gsap.set(this.element, { autoAlpha: 0 })
  }
}