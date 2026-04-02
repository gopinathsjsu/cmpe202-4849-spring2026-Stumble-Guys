# XP Core Values — EventHub

## Communication

Communication has been the backbone of EventHub's development process. From the very first sprint planning meeting, we established a culture of open, honest dialogue. Rather than allowing assumptions to fester, the team committed to over-communicating—sharing blockers early, asking questions freely, and keeping every channel transparent.

**How we practised Communication:**

- **Daily Stand-ups:** Each team member shared progress, plans, and blockers in a short daily sync. This kept everyone aligned and prevented duplicate work across modules (Auth, Events, Tickets, Search).
- **Shared Channels:** We used a dedicated Slack workspace and GitHub Discussions for asynchronous communication. Technical decisions—from database schema changes to API contract updates—were documented in writing so all members could review them at their own pace.
- **Pair Programming Sessions:** When integrating cross-module features (e.g., the frontend ticket-purchase flow calling Sasi's backend API through Pratham's axios client), team members paired up to communicate intent and resolve misunderstandings in real time.
- **Sprint Reviews:** At the end of every sprint, we held live demos where each member presented their work. This created a natural feedback loop: questions from teammates revealed unclear code, missing edge cases, and integration issues before they compounded.
- **Clear Commit Messages and PRs:** Commit messages followed a consistent `feat/fix/refactor(scope): description` convention. Pull request descriptions included context on *why* a change was made, not just *what* changed—making code review conversations productive.

The result was a codebase where no single person was a bottleneck. Any team member could pick up context from documentation, channel history, or commit logs and contribute meaningfully to another module when needed.

---

## Feedback

Feedback, both giving and receiving, shaped EventHub into a significantly better product than any one person's initial design. We treated feedback not as criticism but as **an investment in quality**.

**How we practised Feedback:**

- **Code Reviews:** Every pull request required at least one reviewer. Reviewers focused on clarity, correctness, and consistency rather than style preferences. Comments were phrased constructively ("Have you considered handling the case where…" rather than "This is wrong").
- **Sprint Retrospectives:** After each sprint, we ran structured retros using Start/Stop/Continue. Honest reflections surfaced process improvements—like adding automated linting after Sprint 2 caught formatting inconsistencies, and introducing integration test stubs in Sprint 3 after a cross-module regression.
- **User-Centric Feedback:** We conducted informal usability walkthroughs mid-project. Watching someone navigate the event discovery flow and struggle with the filter panel directly informed Pratham's Sprint 4 UX improvements.
- **Burndown Chart Reviews:** The burndown charts gave us quantitative feedback on velocity. When Sprint 3's chart showed an unexpected plateau, the team discussed scope creep in the retro and re-prioritised Sprint 4 tasks accordingly.
- **Continuous Integration Feedback:** Automated tests and linting in our CI/CD pipeline (GitHub Actions) provided instant, objective feedback on every push. Broken builds were treated as the team's top priority, not the individual committer's problem—reinforcing collective ownership.

By embracing feedback at every level—code, process, product, and metrics—we continuously improved throughout the project lifecycle. Features shipped in Sprint 6 were markedly more polished than Sprint 1 deliverables, not because we became different developers, but because we built a system that made learning from mistakes the default.

---

## Summary

| XP Value       | Key Practice                          | Impact                                           |
| -------------- | ------------------------------------- | ------------------------------------------------ |
| Communication  | Daily stand-ups, shared channels, pairing | Zero knowledge silos; any member could contribute anywhere |
| Feedback       | Code reviews, retros, CI/CD, usability tests | Continuous quality improvement across all sprints |

These two values are deeply complementary: communication creates the **environment** for feedback to flow, and feedback gives communication **substance**. Together, they transformed a four-person team into a cohesive unit that delivered a full-featured event management platform in six sprints.
