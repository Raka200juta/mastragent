"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const chatPanel_1 = require("./chatPanel");
function activate(context) {
    // Command untuk jalanin Mastra Agent
    const runAgent = vscode.commands.registerCommand("mastra.run", () => {
        const terminal = vscode.window.createTerminal("Mastra Agent");
        terminal.show();
        terminal.sendText("cd ~/ai && npm run start");
    });
    // Command untuk buka chat panel
    const openChat = vscode.commands.registerCommand("mastra.chat", () => {
        chatPanel_1.ChatPanel.createOrShow(context.extensionUri);
    });
    context.subscriptions.push(runAgent, openChat);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map