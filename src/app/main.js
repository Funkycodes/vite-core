/*************************/
/*     File Imports      */
/*************************/
import Home from "./pages/Home";
import AutoBind from "auto-bind";
import { delay } from "./utils/math";
import Scroller from "./components/Scroller";
import Scrollbar from "./components/Scrollbar";
import Transition from "./components/Transition";

import "../styles/style.scss";
import "splitting/dist/splitting.css";

class App {
  constructor () {
    AutoBind(this);
    this.init();
  }
  init() {
    this.createPages();
    this.createComponents();

    this.addEvents();
    this.addLinkListeners();
    this.onResize();
    this.update();
  }

  createPages() {
    this.pages = {
      "/": new Home(),
    };
    this.url = window.location.pathname;
    this.page = this.pages[ this.url ];
    this.page.show();
  }

  createComponents() {
    // this.cursor = new Cursor();
    this.scroller = new Scroller({});
    this.scrollbar = new Scrollbar();
    this.transition = new Transition();
  }

  async onChange({ push = true, url = null }) {
    url = url.replace(window.location.origin, "");

    if (this.isFetching || this.url === url) return;

    this.isFetching = true;
    this.url = url;

    await delay(1500);
    await this.page.hide();

    if (push) {
      window.history.pushState({}, document.title, url);
    }

    this.page = this.pages[ url ];

    await delay(1500);
    this.page.show();

    this.isFetching = false;
  }

  // onPreloaded() {
  //   this.preloader.once("completed", () => {
  //     delay(1200).then(() => this.page.show());
  //   });
  // }

  onPopstate() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  onMove(e) {
    if (this.cursor) this.cursor.onMove(e);
  }

  onScroll(e) {
    this.scrollbar.onScroll(e);
  }
  onResize() {
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100);
  }

  addLinkListeners() {
    document.querySelectorAll("a").forEach((link) => {
      const isLocal = link.href.includes(window.location.origin);
      if (isLocal) {
        link.onclick = (e) => {
          e.preventDefault();
          this.transition.animate();
          this.onChange({
            url: link.href,
          });
        };
      } else if (!link.href.includes("mailto") && !link.href.includes("tel")) {
        link.rel = "noopener";
        link.target = "_blank";
      }
      // link.onmouseenter = () => {
      //   this.cursor.onMouseEnter();
      // };
      // link.onmouseleave = () => {
      //   this.cursor.onMouseLeave();
      // };
    });
  }

  addEvents() {
    window.addEventListener("mousemove", this.onMove, { passive: true });
    window.addEventListener("popstate", this.onPopstate, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  update() {
    if (this.cursor)
      this.cursor.update();
    this.scrollbar.update();
    requestAnimationFrame(this.update);
  }
}

new App();

console.log("%c Thanks for visiting our site, from all of us at Studio Infinitus", "background-color:grey; color:white; font-family: 'Segoe UI'");
