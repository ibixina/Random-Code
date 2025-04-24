// This script handles the Stockfish worker in a separate context
const engineURL = chrome.runtime.getURL("engine/stockfish.js");
const wasmURL = chrome.runtime.getURL("engine/stockfish.wasm");

// Set the WASM path for Stockfish to find
if (typeof WebAssembly === "object") {
  self.stockfishWasmPath = wasmURL;
}

// Import the Stockfish script
importScripts(engineURL);

// Handle messages from background script
onmessage = function (e) {
  // Forward message to Stockfish
  postMessage(e.data);
};
