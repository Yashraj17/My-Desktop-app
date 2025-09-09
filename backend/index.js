// backend/index.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const categoryRoutes = require("./routes/categoryRoutes");
const modifierRoutes = require("./routes/modifierRoutes");
const modifierGroupRoutes = require("./routes/modifierGroupRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const menuRoutes = require("./routes/menuRoutes");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  categoryRoutes();
  modifierRoutes(); 
  modifierGroupRoutes();
  menuItemRoutes();
  menuRoutes();
  createWindow();
});
