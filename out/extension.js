"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
function activate(context) {
    let disposable = vscode.commands.registerCommand('mastra.chat', async () => {
        // buka terminal mastra agent
        const terminal = vscode.window.createTerminal('Mastra Agent');
        terminal.show();
        terminal.sendText('cd /home/yor/ai && npm run start');
        // loop input user
        while (true) {
            const message = await vscode.window.showInputBox({
                placeHolder: 'Ketik pesan untuk Mastra (kosongkan untuk keluar)...'
            });
            if (!message) {
                vscode.window.showInformationMessage('Chat Mastra ditutup.');
                break;
            }
            terminal.sendText(message);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map