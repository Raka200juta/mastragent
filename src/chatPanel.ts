import * as vscode from "vscode";
import fetch from "node-fetch"; // tambahin ke dependencies

export class ChatPanel {
  public static currentPanel: ChatPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ChatPanel.currentPanel) {
      ChatPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "mastraChat",
      "Mastra Chat",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    ChatPanel.currentPanel = new ChatPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._panel.webview.html = this._getHtmlForWebview();

    // Terima pesan dari webview
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "sendMessage") {
          const reply = await this._askMastra(message.text);
          this._panel.webview.postMessage({
            command: "reply",
            text: reply
          });
        }
      },
      null,
      this._disposables
    );

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    ChatPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) d.dispose();
    }
  }

  private async _askMastra(prompt: string): Promise<string> {
    try {
      // ganti URL dengan API proxy kamu
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = (await res.json()) as { reply?: string };
      return data.reply || "⚠️ No reply from server";
    } catch (err) {
      return `❌ Error: ${err}`;
    }
  }

  private _getHtmlForWebview(): string {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mastra Chat</title>
        <style>
          body { font-family: sans-serif; padding: 10px; }
          #messages { height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; }
          .user { color: blue; margin: 5px 0; }
          .bot { color: green; margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2>Mastra Chat</h2>
        <div id="messages"></div>
        <input id="input" type="text" style="width:80%" />
        <button onclick="send()">Send</button>

        <script>
          const vscode = acquireVsCodeApi();
          const messagesDiv = document.getElementById('messages');
          function addMessage(text, cls) {
            const div = document.createElement('div');
            div.className = cls;
            div.textContent = text;
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
          function send() {
            const input = document.getElementById('input');
            const text = input.value;
            if (!text) return;
            addMessage("You: " + text, "user");
            vscode.postMessage({ command: "sendMessage", text });
            input.value = "";
          }
          window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === "reply") {
              addMessage("Mastra: " + message.text, "bot");
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}
