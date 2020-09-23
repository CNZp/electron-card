const { ipcMain } = require("electron");
const { send: sendMainWindow } = require("./windows/main");
const { create: createWebviewWindow } = require("./windows/webview");

module.exports = function () {
  ipcMain.on("open-webview", async (e) => {
    createWebviewWindow();
  });
};
