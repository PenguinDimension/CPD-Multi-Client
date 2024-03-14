const { app, BrowserWindow, dialog, autoUpdater, session, globalShortcut } = require("electron");

const path = require("path");
const process = require('process');
const os = require('os');

require('dotenv').config();
let env = process.env;

if (require("electron-squirrel-startup")) app.quit();
if (process.platform != "darwin") require("update-electron-app")({ repo: "PenguinDimension/CPD-Multi-Client" });

const unhandled = require('electron-unhandled');
const createIssue = require('github-create-issue');
const {corrigirAcentos} = require(path.join(__dirname, "lib/extensions/corrigirAcentos"));

const debugInfo = () => {
/*
  let info = `
### Informações da aplicação:
${app.name}: \`v${app.getVersion()}\`
NodeJS: \`v${process.versions.node ?? '0.0.0'}\`
Electron: \`v${process.versions.electron ?? '0.0.0'}\`

### Informações do processo:
Duração: \`${process.uptime()}\` segundos até o erro
Localização: \`${process.cwd()}\`

### Informações do ambiente:
OS: \`${os.type()}\`
Plataforma: \`${os.platform()} (${os.release()})\`
Arch: \`${os.arch()}\`
`;
*/

  let info = `
### Informações da aplicação:
<table>
  <tr>
    <td>${app.name}</td>
    <td><code>v${app.getVersion()}</code></td>
  </tr>
  <tr>
    <td>NodeJS</td>
    <td><code>v${process.versions.node ?? '0.0.0'}</code></td>
  </tr>
  <tr>
    <td>Electron</td>
    <td><code>v${process.versions.electron ?? '0.0.0'}</code></td>
  </tr>
</table>

### Informações do processo:
<table>
  <tr>
    <td>Duração</td>
    <td><code>${process.uptime()}</code> segundos até o erro</td>
  </tr>
  <tr>
    <td>Localização</td>
    <td><code>${process.cwd()}</code></td>
  </tr>
</table>

### Informações do ambiente:
<table>
  <tr>
    <td>OS</td>
    <td><code>${os.type()}</code></td>
  </tr>
  <tr>
    <td>Plataforma</td>
    <td><code>${os.platform()} (${os.release()})</code></td>
  </tr>
  <tr>
    <td>Arch</td>
    <td><code>${os.arch()}</code></td>
  </tr>
</table>
`;

  return corrigirAcentos(info);
};

var issue_opts = (error) => {
  return {
    token: env.GH_TOKEN,
    body: `\`\`\`sh\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
  };
};

function issue_clbk( error, issue, info ) {
  if (info) {
      console.error( 'Limit: %d', info.limit );
      console.error( 'Remaining: %d', info.remaining );
      console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );
  }
  if (error) {
      throw new Error( error.message );
  }
  console.log(JSON.stringify( issue ));
};

unhandled({
  showDialog: true,
	reportButton: error => {
    createIssue('PenguinDimension/CPD-Multi-Client', 'Novo erro!', issue_opts(error), issue_clbk );
	}
});

const pluginPaths = {
  win32: path.join(__dirname, "lib/pepflashplayer.dll"),
  darwin: path.join(__dirname, "lib/PepperFlashPlayer.plugin"),
  linux: path.join(__dirname, "lib/libpepflashplayer.so")
};

if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");

const pluginName = pluginPaths[process.platform];

app.commandLine.appendSwitch("ppapi-flash-path", pluginName);
app.commandLine.appendSwitch("ppapi-flash-version", "31.0.0.122");
app.commandLine.appendSwitch("ignore-certificate-errors");

var mainWindow;

function clearCache() {
  if (mainWindow && mainWindow !== null) {
    mainWindow.webContents.session.clearCache();
    mainWindow.webContents.session.clearAuthCache();
    mainWindow.webContents.session.clearStorageData();
    mainWindow.webContents.session.clearHostResolverCache();
  };
};

const createWindow = () => {

  // Início - tela carregando
  let splashWindow = new BrowserWindow({
    width: 600,
    height: 320,
    frame: false,
    transparent: true,
    show: false,
    icon: path.join(__dirname, "lib/icons/icon.ico") || path.join(__dirname, "lib/icons/icon.png")
  });

  splashWindow.setMenu(null);
  splashWindow.setResizable(false);
  splashWindow.loadURL('https://cpdimensions.com/client/carregando');
  splashWindow.on("closed", () => (splashWindow = null));
  splashWindow.webContents.on("did-finish-load", () => {
    splashWindow.show();
  });
  // Fim - tela carregando

  // TELA INICIAL
  mainWindow = new BrowserWindow({
    useContentSize: false,
    show: false,
    autoHideMenuBar: true,
    width: 960,
    height: 540,
    icon: path.join(__dirname, "lib/icons/icon.ico") || path.join(__dirname, "lib/icons/icon.png"),
    webPreferences: {
      plugins: true
    }
  });
  mainWindow.setResizable(true);

  mainWindow.webContents.on("did-finish-load", () => {
    if (splashWindow) {
      splashWindow.close();
      mainWindow.show();
    };
  });

  new Promise(resolve => setTimeout(() => {
    clearCache();
    mainWindow.loadURL(`https://cpdimensions.com`);
    title: "";
    resolve();
  }, 5000));

  mainWindow.on('closed', () => (mainWindow = null));

};

if (!app.requestSingleInstanceLock()) return app.quit();

app.on("second-instance", (event, commandLine, workingDirectory) => {
  dialog.showMessageBox({
    type: "info",
    title: "AVISO!",
    message: "Você não pode executar mais de 1 instância do nosso cliente multi!"
  });
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  };
});

app.setAsDefaultProtocolClient("cpdm");

app.on("ready", function () {
  // if (isThereAnError) return;
  createWindow();

  globalShortcut.register('Alt+CommandOrControl+B', () => {
    mainWindow.loadURL("https://beta.cpdimensions.com");
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = `cpdimensions-multi/${app.getVersion()}`;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  };
});

setInterval(clearCache, 1000*60*30); //Limpar o cache de 30 em 30 minutos