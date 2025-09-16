import * as vscode from "vscode";
import { ChatPanel } from "./chatPanel";

export function activate(context: vscode.ExtensionContext) {
  // Command untuk jalanin Mastra Agent
  const runAgent = vscode.commands.registerCommand("mastra.run", () => {
    const terminal = vscode.window.createTerminal("Mastra Agent");
    terminal.show();
    terminal.sendText("cd ~/ai && npm run start");
  });

  // Command untuk buka chat panel
  const openChat = vscode.commands.registerCommand("mastra.chat", () => {
    ChatPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(runAgent, openChat);
}

export function deactivate() {}
