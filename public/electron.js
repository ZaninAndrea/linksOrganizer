const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { exec } = require('child_process');
const {ipcMain, shell, dialog} = require('electron')
const generatePreview = require("./generatePreview.js")
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require("fs")

let previewCache={} // cache of link previews used in the markdown preview

const insertInPreviewCache = url => sender => preview => {
    previewCache[url] = preview // caches the preview
    sender.send("linkPreviewReady") // notifies the react app that the preview is ready
}

// handle link preview creation
ipcMain.on("linkPreview", (event, ...args) => {
    if (previewCache.hasOwnProperty(args.toString())){
        event.returnValue = previewCache[args.toString()] // returns the cached preview
    } else {
        generatePreview(...args, insertInPreviewCache(args.toString())(event.sender) ) // asynchronous preview creation
        event.returnValue = args[0] // while the preview is being create display just the link
    }
})
let mainWindow;

ipcMain.on("save", (event, links) => {
    dialog.showSaveDialog({}, function (filePath) {
        fs.writeFile(filePath, JSON.stringify(links), function (err) {
            event.returnValue = err
        });
    });
})

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`); // load the react app
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

// on MacOS leave process running also with no windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// if there are no windows create one
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
