# Publishing RubberDuck on the Cursor Marketplace

Follow these steps to submit the plugin for review and listing.

---

## 1. Put the repo on GitHub (if you haven’t)

1. Create a new **public** repository on GitHub (e.g. `RubberDuck`).
2. Add it as a remote and push:

   ```bash
   cd /Users/paimaamu/projects/RubberDuck
   git remote add origin https://github.com/YOUR_USERNAME/RubberDuck.git
   git add .
   git commit -m "Prepare for Cursor marketplace"
   git push -u origin main
   ```

3. Replace **YOUR_USERNAME** with your GitHub username everywhere (see step 2 below).

---

## 2. Set the real repo URL in the manifest

Edit **`.cursor-plugin/plugin.json`** and replace the placeholders with your real GitHub repo:

- `https://github.com/YOUR_USERNAME/RubberDuck#readme` → your repo URL + `#readme`
- `https://github.com/YOUR_USERNAME/RubberDuck` → your repo URL

Example if your username is `jane`:

```json
"homepage": "https://github.com/jane/RubberDuck#readme",
"repository": "https://github.com/jane/RubberDuck",
```

Commit and push after editing.

---

## 3. (Optional) Set your name in the manifest

In `.cursor-plugin/plugin.json`, you can set the author to your name or your project name:

```json
"author": {
  "name": "Your Name",
  "email": "your@email.com"
}
```

---

## 4. Submit on the Cursor marketplace

1. Open: **[cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)**  
2. Sign in with the account you want associated with the plugin.  
3. Enter your plugin’s **public Git repository URL**, e.g.  
   `https://github.com/YOUR_USERNAME/RubberDuck`  
4. Submit the form.  
5. Cursor will review the plugin (manual review). You may get feedback or approval by email or in the Cursor UI; wait for their response.

---

## 5. Submission checklist (already done in this repo)

- [x] Valid `.cursor-plugin/plugin.json` with `name`, `description`, `version`
- [x] `name` is lowercase kebab-case: `rubber-duck`
- [x] All manifest paths are relative (no `..` or absolute paths)
- [x] `README.md` documents usage and configuration
- [x] Logo at `assets/logo.png` and referenced in manifest
- [x] Rules and skills have proper YAML frontmatter (`description`, `name`, etc.)
- [ ] **You:** Replace `YOUR_USERNAME` in `plugin.json` with your GitHub username and push
- [ ] **You:** Repo is public on GitHub
- [ ] **You:** Submit the repo URL at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)

---

## After submission

- **Review time:** Can take a few days; Cursor will contact you if they need changes.
- **Updates:** After it’s listed, push changes to the same repo; you may need to resubmit or trigger an update depending on Cursor’s process.
- **Extension:** The **VS Code extension** in `extension/` is separate. The marketplace listing is for the **Cursor plugin** (rules + skill). The extension is installed from the repo or “Install from Location” for now; distributing it via a marketplace would be a separate step (e.g. Open VSX or Cursor’s extension flow if they add one).

---

## Quick link

**Publish page:** [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
