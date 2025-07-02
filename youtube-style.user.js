// ==UserScript==
// @name         Change Video Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
          position: sticky;
          z-index: 999999999;
          top: 0;
    }
`);
})();
