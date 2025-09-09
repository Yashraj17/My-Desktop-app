const { app, BrowserWindow, ipcMain } = require("electron");
const Database = require("better-sqlite3");
const path = require("path");
let db;

const userDataPath = app.getPath("userData");
const dbFilePath = path.join(userDataPath, "app.db");

  // Create the database in the userData path (it auto-creates if it doesn't exist)
db = new Database(dbFilePath);
module.exports = db;
