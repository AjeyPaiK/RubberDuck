# RubberDuck extension

VS Code/Cursor extension that sends your **live debugger state** (call stack, scopes, variables) to the agent so you can rubber-duck debug while paused at a breakpoint.

## Commands

| Command | Description |
|--------|-------------|
| **RubberDuck: Send debug context to agent** | Copies debug context (stack + variables) to clipboard and opens a new agent chat. Paste and describe your question. Shortcut: **Cmd+Shift+D** / **Ctrl+Shift+D** when stopped at a breakpoint. |
| **RubberDuck: Copy debug context to clipboard** | Same context, copy only (no chat). |

## Requirements

- Active debug session (debugger started and paused at a breakpoint).
- Debug adapter that supports DAP (threads, stackTrace, scopes, variables). Most built-in and common debuggers do.

## Build

```bash
npm install
npm run compile
```

## Install in Cursor

- **From folder:** Command Palette → **Developer: Install Extension from Location...** → select this `extension` folder.
- **From VSIX:** Run a package script if you add one, or use **vsce package** after installing `@vscode/vsce`.

## How it works

The extension uses the [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/) via `vscode.debug.activeDebugSession.customRequest()` to fetch:

1. Threads
2. Stack trace for the current thread
3. Scopes for the top stack frame (where you're stopped)
4. Variables for each scope (locals, closure, etc.)

That is formatted as markdown and copied to the clipboard. When you paste it into the agent, the RubberDuck Cursor plugin (skill + rule) treats it as rubber-duck context and responds with questions and structure instead of jumping to a fix.
