const fs = require('fs');
const {app, BrowserWindow} = require('electron');

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    images: false,
    webgl: false
  });
  win.loadURL('https://unicode.org/emoji/charts/full-emoji-list.html');
  console.log('please wait');
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(
      `(() => {
        const emoji = {};
        const mediumhead = (subgroups, tr) => {
          const name = tr.firstElementChild.textContent.trim();
          const list = subgroups[name] || (subgroups[name] = {});
          while (tr = tr.nextElementSibling) {
            const {classList} = tr.firstElementChild;
            if (classList.contains('bighead'))
              return;
            const name = tr.querySelector('td.name');
            if (name) {
              const code = tr.querySelector('td.code');
              if (code) {
                const text = code.textContent.trim();
                const unicode = text.replace(/U\\+/g, '0x').replace(/[\\s\\n\\r\\f]+/g, ', ');
                const key = eval('String.fromCodePoint(' + unicode + ')');
                list[key] = name.textContent.trim();
              }
            }
          }
        };
        document.querySelectorAll('th.bighead').forEach(th => {
          const group = th.textContent.trim();
          const subgroups = emoji[group] || (emoji[group] = {});
          let tr = th.parentElement;
          while (tr && (tr = tr.nextElementSibling)) {
            const {classList} = tr.firstElementChild;
            if (classList.contains('mediumhead'))
              mediumhead(subgroups, tr);
            else if (classList.contains('bighead'))
              return;
          }
        });
        return emoji;
      })()`,
      emoji => {
        fs.writeFile(
          'index.js',
          `var emojiEssential = ${JSON.stringify(emoji, null, '  ')};\n`,
          err => {
            if (err) {
              console.error(err);
              process.exit(1);
            }
            win.close();
          }
        );
      }
    );
  });
});
