import gsap from "gsap"
import Splitting from "splitting";
import Animation from "../classes/Animation";

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements
    })

    this.splitText();
    this.ParagraphsLines = this.element.querySelectorAll("span");
    this.animateOut()
  }

  splitText() {
    Splitting({ target: this.element, by: "lines" });
  }

  animateIn() {
    this.ParagraphsLines.forEach(line => {
      const lineIndex = + (line.style.getPropertyValue("--line-index"));

      gsap.timeline()
        .set(this.element, { autoAlpha: 1 })
        .set(line, { autoAlpha: 0, y: "100%" })
        .to(line, {
          y: 0,
          autoAlpha: 1,
          delay: 0.15 * lineIndex,
          duration: 0.75,
          ease: "back.out(1)"
        })
    })

  }
  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }
}