const { ipcMain } = require("electron");
const { create: createControlWindow } = require("./windows/control");
const { send: sendMainWindow } = require("./windows/main");

module.exports = function () {
  ipcMain.handle("ask-control", async () => {
    let index = 0;
    setInterval(() => {
      sendMainWindow("control-time", ++index);
    }, 1 * 1000);

    createControlWindow();
    return true;
  });
};
