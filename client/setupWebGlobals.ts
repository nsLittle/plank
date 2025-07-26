// client/setupWebGlobals.ts
export function injectGlobalWebStyles() {
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
        html, body, #root, #app, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: auto;
        }
      `;
    document.head.appendChild(style);
  }
}
