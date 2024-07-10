import LocomotiveScroll from "locomotive-scroll";
let instance = null;

export default class Scroller extends LocomotiveScroll {
  constructor ({ lenisOptions, modularInstance }) {
    if (instance) {
      return instance;
    }
    const scrollCallback = ({ scroll, limit, progress }) => {
      this.scroll = scroll;
      this.limit = limit;
      this.progress = progress;
    };
    super({ lenisOptions, modularInstance, scrollCallback });

    this.scroll;
    this.limit;
    this.progress;

    instance = this;
  }
}