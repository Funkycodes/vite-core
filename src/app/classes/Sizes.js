let instance = null;

export default class Sizes {
  constructor () {
    if (instance)
      return instance;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    instance = this;
  }

  onResize() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
}