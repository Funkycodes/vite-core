import gsap from "gsap";
import Animation from "../classes/Animation"

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
      y: "-100%",
      autoAlpha: 0,
    }, {
      y: 0,
      autoAlpha: 1,
    })
  }
  animateOut() {
    gsap.set(this.element, { autoAlpha: 0 })
  }
}