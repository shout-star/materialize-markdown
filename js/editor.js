var remote = require('remote');
var fs = require('fs');
var dialog = remote.require('dialog');
var browserWindow = remote.require('browser-window');

/**
 * ファイルを開く
 */
function loadFile() {
    var win = browserWindow.getFocusedWindow();
    dialog.showOpenDialog(
        win,
        {
            properties: ['openFile'],
            filters: [
                {
                    name: 'Markdown',
                    extensions: ['md', 'txt']
                }
            ]
        },
        function (filenames) {
            if (filenames) {
                fs.readFile(filenames[0], function (error, text) {
                    if (error != null) {
                        alert('error : ' + error);
                        return;
                    }
                    mdEditor.setValue(text.toString());
                    Materialize.toast('Load complete.', 1000);
                });
                footerVm.currentPath = filenames[0];
            }
        });
}

/**
 * ファイルを保存する
 */
function saveFile() {
    if (footerVm.currentPath == "") {
        saveNewFile();
        return;
    }
    var win = browserWindow.getFocusedWindow();
    dialog.showMessageBox(win,
        {
            title: 'ファイルの上書き保存を行います。',
            type: 'info',
            buttons: ['OK', 'Cancel'],
            detail: '本当に保存しますか？'
        },
        function (res) {
            if (res == 0) {
                var data = mdEditor.getValue();
                writeFile(footerVm.currentPath, data);
            }
        }
    );
}

/**
 * ファイルを新規に保存する
 */
function saveNewFile() {
    var win = browserWindow.getFocusedWindow();
    dialog.showSaveDialog(
        win,
        {
            properties: ['openFile'],
            filters: [
                {
                    name: 'Documents',
                    extensions: ['md', 'txt']
                }
            ]
        },
        function (fileName) {
            if (fileName) {
                var data = mdEditor.getValue();
                footerVm.currentPath = fileName;
                writeFile(fileName, data);
            }
        }
    );
}

/**
 * ファイルを書き込む
 */
function writeFile(path, data) {
    fs.writeFile(path, data, function (error) {
        if (error != null) {
            alert('error : ' + error);
        }
        Materialize.toast('Save complete.', 1000);
    });
}