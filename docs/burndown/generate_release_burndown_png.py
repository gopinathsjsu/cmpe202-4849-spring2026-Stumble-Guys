#!/usr/bin/env python3
"""Generate docs/burndown/release-burndown.png from sprint totals."""
import matplotlib.pyplot as plt

labels = [
    "Feb 9\n(start)",
    "End S1\nFeb 22",
    "End S2\nMar 8",
    "End S3\nMar 22",
    "End S4\nApr 5",
    "End S5\nApr 19",
    "End S6\nMay 4",
]
total_scope = 206
completed_per_sprint = [0, 32, 38, 40, 34, 30, 24]

cum = 0
actual = []
ideal = []
for i, c in enumerate(completed_per_sprint):
    cum += c
    actual.append(total_scope - cum)
    steps = len(completed_per_sprint) - 1
    ideal.append(round(total_scope * (1 - i / steps), 2))

x = range(len(labels))

fig, ax = plt.subplots(figsize=(10, 5.5), dpi=150)
ax.plot(x, actual, "o-", color="#ea580c", linewidth=2.5, markersize=9, label="Actual remaining")
ax.plot(x, ideal, "s--", color="#64748b", linewidth=2, markersize=6, label="Ideal remaining (linear)")
ax.fill_between(x, actual, alpha=0.12, color="#ea580c")

ax.set_xticks(list(x))
ax.set_xticklabels(labels, fontsize=9)
ax.set_ylabel("Remaining story points")
ax.set_xlabel("Sprint milestone")
ax.set_title("EventHub — Release burndown (206 pts planned, 198 completed)")
ax.legend(loc="upper right")
ax.grid(True, linestyle=":", alpha=0.6)
ax.set_ylim(0, total_scope + 10)

for xi, yi in zip(x, actual):
    ax.annotate(str(int(yi)), (xi, yi), textcoords="offset points", xytext=(0, 8), ha="center", fontsize=8)

plt.tight_layout()
out = __file__.replace("generate_release_burndown_png.py", "release-burndown.png")
plt.savefig(out, bbox_inches="tight")
print("Wrote", out)
