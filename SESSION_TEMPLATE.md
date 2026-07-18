# Session Log

Copy this block to the top of `SESSION_LOG.md` at the start of every
working session and fill it in at the end. This is what you paste back
to Claude at the start of a new chat so we don't lose context — Claude
has no memory between separate conversations, this file is the memory.

---

## Session N — YYYY-MM-DD

**Version/ticket worked on:** e.g. V1 / AUTH-02

**Branch:** feature/auth-login

**Started with:** (1-line state of the world when you started)

**What got built:**
-

**Decisions made (and why):**
-

**Anything flagged/fixed (SOLID/DRY/tenant isolation):**
-

**Tests added/passing:**
-

**Left off at / blockers:**
-

**Next session starts with:**
-

---

### How to resume a session with Claude
Paste in: this file's latest entry + `git diff --stat` output + which
ticket you're picking up from BACKLOG.md. That's enough for a cold
start with full context, no re-explaining the project.
