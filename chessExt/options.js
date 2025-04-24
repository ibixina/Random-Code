document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("depth");
  chrome.storage.sync.get({ depth: 5 }, (prefs) => {
    input.value = prefs.depth;
  });
  document.getElementById("save").addEventListener("click", () => {
    const depth = parseInt(input.value, 10) || 5;
    chrome.storage.sync.set({ depth });
    alert("Saved depth = " + depth);
  });
});
