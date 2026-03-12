import * as vscode from "vscode";

// DAP response shapes (simplified)
interface DAPThread {
  id: number;
  name?: string;
}
interface DAPStackFrame {
  id: number;
  name?: string;
  line?: number;
  column?: number;
  source?: { path?: string; name?: string };
}
interface DAPScope {
  name: string;
  variablesReference: number;
}
interface DAPVariable {
  name: string;
  value: string;
  variablesReference?: number;
}

async function getDebugContext(): Promise<string> {
  const session = vscode.debug.activeDebugSession;
  if (!session) {
    throw new Error("No active debug session. Start the debugger and pause at a breakpoint first.");
  }

  const lines: string[] = [];
  lines.push("# RubberDuck – Debug context");
  lines.push("");
  lines.push("**Session:** " + (session.name || "debug"));
  lines.push("**Type:** " + (session.type || "unknown"));
  lines.push("");

  try {
    // 1. Threads
    const threadsResp = await session.customRequest("threads", {});
    const threads = (threadsResp as { threads?: DAPThread[] }).threads ?? [];
    if (threads.length === 0) {
      lines.push("No threads reported by the debug adapter.");
      return lines.join("\n");
    }

    const threadId = threads[0].id;
    lines.push("## Thread: " + (threads[0].name ?? String(threadId)));
    lines.push("");

    // 2. Stack trace
    const stackResp = await session.customRequest("stackTrace", { threadId });
    const stackFrames = (stackResp as { stackFrames?: DAPStackFrame[] }).stackFrames ?? [];
    if (stackFrames.length === 0) {
      lines.push("No stack frames.");
      return lines.join("\n");
    }

    lines.push("## Call stack");
    lines.push("");
    for (let i = 0; i < stackFrames.length; i++) {
      const f = stackFrames[i];
      const loc = f.source?.path
        ? `${f.source.name ?? f.source.path}:${f.line ?? "?"}:${f.column ?? "?"}`
        : `line ${f.line ?? "?"}`;
      lines.push(`${i + 1}. **${f.name ?? "(anonymous)"}** — ${loc}`);
    }
    lines.push("");

    // 3. Scopes and variables for the top frame (current breakpoint)
    const topFrameId = stackFrames[0].id;
    lines.push("## Current frame (top of stack)");
    lines.push("");
    lines.push(`**${stackFrames[0].name ?? "(anonymous)"}**`);
    if (stackFrames[0].source?.path) {
      lines.push(`File: \`${stackFrames[0].source.path}\` (line ${stackFrames[0].line ?? "?"})`);
    }
    lines.push("");

    const scopesResp = await session.customRequest("scopes", { frameId: topFrameId });
    const scopes = (scopesResp as { scopes?: DAPScope[] }).scopes ?? [];

    for (const scope of scopes) {
      if (scope.variablesReference === 0) continue;
      const varsResp = await session.customRequest("variables", {
        variablesReference: scope.variablesReference,
      });
      const vars = (varsResp as { variables?: DAPVariable[] }).variables ?? [];
      if (vars.length === 0) continue;

      lines.push("### " + scope.name);
      lines.push("");
      for (const v of vars) {
        const value = v.value || "(empty)";
        const truncated = value.length > 200 ? value.slice(0, 200) + "…" : value;
        lines.push("- **" + v.name + "**: " + truncated);
      }
      lines.push("");
    }

    lines.push("---");
    lines.push("*Paste this into the agent chat and describe what you expected vs what you see. RubberDuck will help you reason through it.*");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    lines.push("**Error while reading debug state:** " + msg);
  }

  return lines.join("\n");
}

async function copyAndNotify(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text);
  void vscode.window.showInformationMessage(
    "RubberDuck: Debug context copied to clipboard. Paste it into the agent chat."
  );
}

async function openAgentChat(): Promise<void> {
  // Cursor: open new agent chat so user can paste the context we just copied
  const cmd = "composer.newAgentChat";
  try {
    await vscode.commands.executeCommand(cmd);
  } catch {
    // Fallback: user can paste from clipboard into existing chat
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const sendToAgent = vscode.commands.registerCommand(
    "rubber-duck.sendDebugContextToAgent",
    async () => {
      try {
        const text = await getDebugContext();
        await copyAndNotify(text);
        await openAgentChat();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        void vscode.window.showErrorMessage("RubberDuck: " + msg);
      }
    }
  );

  const copyOnly = vscode.commands.registerCommand(
    "rubber-duck.copyDebugContext",
    async () => {
      try {
        const text = await getDebugContext();
        await copyAndNotify(text);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        void vscode.window.showErrorMessage("RubberDuck: " + msg);
      }
    }
  );

  context.subscriptions.push(sendToAgent, copyOnly);
}

export function deactivate(): void {}
