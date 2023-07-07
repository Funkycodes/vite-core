import Home from "./pages/Home";
import AutoBind from "auto-bind";
import Cursor from "./components/Cursor";
import Detection from "./classes/Detection";
import Transition from "./components/Transition";
import Preloader from "./components/Preloader";
import { delay } from "./utils/math";

import "../styles/style.scss";

class App {
  constructor() {
    AutoBind(this);
    this.init();
  }
  init() {
    this.url = window.location.pathname;
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.createPages();
    this.createComponents();
    this.onPreloaded()

    this.addEvents();
    this.addLinkListeners();

    this.update();
    this.onResize();
  }
  async createPages() {
    this.pages = {
      "/": new Home(),
    };
    this.page = this.pages[this.url];
  }

  async onChange({ push = true, url = null }) {
    url = url.replace(window.location.origin, "");

    if (this.isFetching || this.url === url) return;

    this.isFetching = true;
    this.url = url;

    await this.page.hide();

    if (push) {
      window.history.pushState({}, document.title, url);
    }

    this.page = this.pages[url];

    this.onResize();
    await this.page.show(this.url);

    this.isFetching = false;
  }

  createComponents() {
    this.cursor = new Cursor();

    this.preloader = new Preloader();
    this.transition = new Transition();
  }

  onPreloaded() {
    this.preloader.once("completed", () => {
      delay(1200).then(() => this.page.show());
      this.transition.animate()
    })
  }

  update() {
    if (this.page) {
      this.page.update();
    }
    this.cursor.update();
    requestAnimationFrame(this.update);
  }

  onTouchStart(event) {
    event.stopPropagation();

    if (!Detection.isMobile() && event.target.tagName === "A") return;

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

    this.page.onTouchStart(event);
  }

  onTouchMove(event) {
    event.stopPropagation();

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;
    this.page.onTouchMove(event);
  }

  onTouchEnd(event) {
    event.stopPropagation();

    this.mouse.x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    this.mouse.y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchEnd(event);
    }
  }

  onResize() {
    if (this.page) this.page.onResize();
  }

  onWheel(e) {
    this.page.onWheel(e);
  }

  onMove(e) {
    if (this.cursor) this.cursor.onMove(e);
  }

  onPopstate() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  addLinkListeners() {
    document.querySelectorAll("a").forEach((link) => {
      const isLocal = link.href.includes(window.location.origin);
      if (isLocal) {
        link.onclick = (e) => {
          e.preventDefault();
          this.onChange({
            url: link.href,
          });
        };
      } else if (!link.href.includes("mailto") && !link.href.includes("tel")) {
        link.rel = "noopener";
        link.target = "_blank";
      }
      link.onmouseenter = () => {
        this.cursor.onMouseEnter();
      };
      link.onmouseleave = () => {
        this.cursor.onMouseLeave();
      };
    });
  }

  addEvents() {
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("popstate", this.onPopstate, { passive: true });

    // wheel
    window.addEventListener("wheel", this.onWheel, { passive: true });
    window.addEventListener("mousemove", this.onMove, { passive: true });

    // mouse
    //window.addEventListener("mousedown", this.onTouchStart, { passive: true });
    //window.addEventListener("mousemove", this.onTouchMove, { passive: true });
    //window.addEventListener("mouseup", this.onTouchEnd, { passive: true });

    // touch
    window.addEventListener("touchstart", this.onTouchStart, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: true });
    window.addEventListener("touchend", this.onTouchEnd, { passive: true });
  }
}

new App();