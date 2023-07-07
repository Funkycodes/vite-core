import Page from "../classes/Page";
import { delay } from "../utils/math";

export default class Home extends Page {
  constructor() {
    super({
      selector: ".about",
      selectors: {
        wrapper: ".about__wrapper",
      },
      classes: {
        activeClassName: "about--active",
      },
    });
  }

  async show() {
    super.show();
    await delay(400);
    this.element.classList.add(this.classes.activeClassName);
  }
  hide() {
    super.hide();
    this.element.classList.remove(this.classes.activeClassName);
  }
}
