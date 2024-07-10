import Page from "../classes/Page";

export default class Home extends Page {
  constructor () {
    super({
      selector: ".about",
      selectors: {
        wrapper: ".about__wrapper",
      },
      classes: {
        active: "is-active"
      },
    });
  }

  async show() {
    super.show();
    this.element.classList.add(this.classes.active);
  }
  hide() {
    super.hide();
    this.element.classList.remove(this.classes.active);
  }
}
