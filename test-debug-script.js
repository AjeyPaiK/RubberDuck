/**
 * Minimal script to test RubberDuck extension.
 * Set a breakpoint on the line with "breakpoint here", then F5 → when it stops, run RubberDuck: Send debug context to agent.
 */
function greet(name) {
  const message = "Hello, " + name + "!";  // breakpoint here
  return message;
}

const x = 42;
const who = "RubberDuck";
const result = greet(who);
console.log(result);
