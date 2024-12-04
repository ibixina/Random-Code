// ==UserScript==
// @name         template
// @namespace    template.zero.nao
// @version      0.1
// @description  try to tke over the world!
// @author       nao [2669774]
// @match        https://humanbenchmark.com/tests/typing
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @updateURL    <UPDATE_URL>
// @downloadURL  <DOWNLOAD_URL>

// ==/UserScript==

const element = document.querySelectorAll(".letters");
const text = element.innerText;

function simulateTyping(text, delay = 100) {
  let index = 0;

  function type() {
    if (index < text.length) {
      const char = text[index];

      // Create and dispatch keydown event
      const keydownEvent = new KeyboardEvent("keydown", { key: char });
      document.dispatchEvent(keydownEvent);

      // Create and dispatch keyup event
      const keyupEvent = new KeyboardEvent("keyup", { key: char });
      document.dispatchEvent(keyupEvent);
      index++;
      setTimeout(type, delay);
    }
  }

  type();
}

setTimeout(simulateTyping, 5000, text);
