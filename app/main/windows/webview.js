const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let winStore = {};

function create() {
  let win = new BrowserWindow({
    width: 930,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      nativeWindowOpen: true,
    },
  });

  let id = win.webContents.id;
  winStore[id] = win;

  win.loadFile(
    path.resolve(__dirname, "../../renderer/pages/webview/index.html")
  );

  win.on("close", () => {
    delete winStore[id];
  });
}

module.exports = { create };
