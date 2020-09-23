const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let winStore = {};

function create() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    },
  });

  let id = win.webContents.id;
  winStore[id] = win;

  win.loadFile(
    path.resolve(__dirname, "../../renderer/pages/webview/index.html")
  );
  
  // win.webContents.openDevTools();

  win.on("close",()=>{
    delete winStore[id];
  })
}

module.exports = { create };
