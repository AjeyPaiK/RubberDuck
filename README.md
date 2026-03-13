# RubberDuck

**A vibe coded plugin for responsible programmers.**

Talk through bugs with an LLM instead of pasting and praying. RubberDuck turns your Cursor agent into a rubber duck: it asks questions, reflects your reasoning, and keeps you in the driver's seat so you **understand, then fix**.

**Why it stands out:** Most AI debugging is paste error → get fix. RubberDuck is the only Cursor plugin that (1) makes the agent *listen and ask questions* instead of jumping to a fix, and (2) one-click sends your **live debugger state** (stack + variables) into the chat when you're paused at a breakpoint.

---

## What it does

- **Rubber-duck style debugging:** Explain the bug, what you tried, and what's weird—get questions and structure, not just a patch.
- **Skill: Rubber Duck Debug** — The agent guides you with clarifying questions and reflects your reasoning before suggesting fixes.
- **Rule: Debug Talk First** — When you're debugging in code files, the agent is nudged to ask "what did you expect? what have you tried?" before jumping to solutions.
- **Works with the debugger:** The **VS Code extension** (in `extension/`) reads your live debug session (call stack, scopes, variables) and sends that context to the agent so you can rubber-duck while paused at a breakpoint.

---

## Install

### 1. Cursor plugin (rules + skill)

- **From Cursor:** Install via the Cursor plugin/marketplace (once published), or add from path.
- **Local:** Clone the repo, then in Cursor add the plugin from the `RubberDuck` folder (Settings → Plugins → Add from path).
- **Publish:** [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

### 2. VS Code extension (debugger integration)

The extension runs inside Cursor and hooks into the debugger. When you're paused at a breakpoint, it can copy your **call stack and variables** and open the agent chat.

**Install from source (development):**

```bash
cd RubberDuck/extension
npm install
npm run compile
```

Then in Cursor:

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
2. Run **Developer: Install Extension from Location...** and choose the `extension` folder.

Or open the repo in Cursor and press **F5** to launch Extension Development Host; the extension will be loaded there.

**Usage when debugging:**

1. Start debugging (F5) and pause at a breakpoint.
2. Run **RubberDuck: Send debug context to agent** (Command Palette), or press **Cmd+Shift+D** / **Ctrl+Shift+D** while stopped.
3. Debug context (stack + variables) is copied to the clipboard and a new agent chat opens. Paste (Cmd+V) and add your question—e.g. “I’m stopped here; I expected X but see Y.”
4. The RubberDuck skill will treat this as rubber-duck context: reflect, ask questions, then help you fix.

You can also use **RubberDuck: Copy debug context to clipboard** if you only want the context without opening the chat.

---

## Plugin layout

```
RubberDuck/
├── .cursor-plugin/
│   └── plugin.json
├── skills/
│   └── rubber-duck-debug/
│       └── SKILL.md
├── rules/
│   └── debug-talk-first.mdc
├── extension/                    # VS Code extension (debugger integration)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── extension.ts
├── POSITIONING.md
└── README.md
```

---

## License

MIT
