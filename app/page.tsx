"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  id: number;
  name: string;
  xp: number;
};

type MemberWithProgress = Member & {
  level: number;
  currentXp: number;
};

const XP_PER_LEVEL = 64;

const members: Member[] = [
  {
    id: 1,
    name: "Kai",
    xp: 198,
  },
  {
    id: 2,
    name: "Mina",
    xp: 252,
  },
  {
    id: 3,
    name: "Jordan",
    xp: 145,
  },
  {
    id: 4,
    name: "Riley",
    xp: 231,
  },
  {
    id: 5,
    name: "Nora",
    xp: 119,
  },
  {
    id: 6,
    name: "Elio",
    xp: 173,
  },
  {
    id: 7,
    name: "Sage",
    xp: 264,
  },
  {
    id: 8,
    name: "Iris",
    xp: 96,
  },
];

function getMemberProgress(lifetimeXp: number) {
  const level = Math.floor(lifetimeXp / XP_PER_LEVEL) + 1;
  const currentXp = lifetimeXp % XP_PER_LEVEL;

  return { level, currentXp };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  }

  const membersWithProgress = useMemo<MemberWithProgress[]>(
    () =>
      members.map((member) => {
        const { level, currentXp } = getMemberProgress(member.xp);

        return { ...member, level, currentXp };
      }),
    [],
  );

  const sortedByCurrentXp = useMemo(
    () =>
      [...membersWithProgress].sort(
        (a, b) => b.currentXp - a.currentXp || b.xp - a.xp,
      ),
    [membersWithProgress],
  );

  const topFive = useMemo(() => sortedByCurrentXp.slice(0, 5), [sortedByCurrentXp]);

  const featuredMember = topFive[0];
  const level = featuredMember.level;
  const xpIntoCurrentLevel = featuredMember.currentXp;
  const progressPercent = (xpIntoCurrentLevel / XP_PER_LEVEL) * 100;

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return membersWithProgress;
    }

    return membersWithProgress.filter((member) =>
      member.name.toLowerCase().includes(q),
    );
  }, [query, membersWithProgress]);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 py-8 sm:px-8 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top_left,_#0f172a,_#111827_40%,_#0f172a_100%)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top_left,_#fef3c7,_#f8fafc_40%,_#e0f2fe_100%)] text-slate-900"
      }`}
    >
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              isDark
                ? "border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "border-slate-300 bg-white/90 text-slate-800 hover:bg-white"
            }`}
            aria-label="Toggle dark and light mode"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <section
          className={`overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-sm sm:p-8 ${
            isDark
              ? "border-amber-400/20 bg-slate-900/70 shadow-black/40"
              : "border-amber-200/70 bg-white/85 shadow-amber-100"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Current Level
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Level {level}
            </h1>
            <p className={`text-sm font-medium sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {xpIntoCurrentLevel} / {XP_PER_LEVEL} XP
            </p>
          </div>

          <div className={`mt-5 h-4 w-full overflow-hidden rounded-full ${isDark ? "bg-slate-700" : "bg-amber-100"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className={`mt-3 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {featuredMember.name} is leading right now with {featuredMember.currentXp} current XP.
          </p>
        </section>

        <section
          className={`rounded-3xl border p-6 shadow-lg backdrop-blur-sm sm:p-8 ${
            isDark
              ? "border-sky-400/20 bg-slate-900/70 shadow-black/40"
              : "border-sky-200/80 bg-white/85 shadow-sky-100"
          }`}
        >
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Top 5 members by current XP
          </p>

          <div
            className={`mt-4 overflow-x-auto rounded-xl border ${
              isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"
            }`}
          >
            <table className="min-w-full text-left text-sm">
              <thead
                className={`text-xs uppercase tracking-wide ${
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                }`}
              >
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Member Name</th>
                  <th className="px-4 py-3">Current XP</th>
                </tr>
              </thead>
              <tbody>
                {topFive.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
                  >
                    <td className={`px-4 py-3 font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      #{index + 1}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {member.name}
                    </td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {member.currentXp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className={`rounded-3xl border p-6 shadow-lg backdrop-blur-sm sm:p-8 ${
            isDark
              ? "border-teal-400/20 bg-slate-900/70 shadow-black/40"
              : "border-teal-200/80 bg-white/85 shadow-teal-100"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Members</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Search members and view stats in a table
              </p>
            </div>

            <label className="w-full sm:max-w-xs">
              <span className="sr-only">Search members</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-teal-500 ${
                  isDark
                    ? "border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              />
            </label>
          </div>

          <div
            className={`mt-5 overflow-x-auto rounded-xl border ${
              isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"
            }`}
          >
            {filteredMembers.length === 0 ? (
              <p
                className={`rounded-xl border border-dashed p-4 text-sm ${
                  isDark
                    ? "border-slate-600 bg-slate-800 text-slate-300"
                    : "border-slate-300 bg-slate-50 text-slate-600"
                }`}
              >
                No members found for this search.
              </p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead
                  className={`text-xs uppercase tracking-wide ${
                    isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <tr>
                    <th className="px-4 py-3">Member Name</th>
                    <th className="px-4 py-3">Current XP</th>
                    <th className="px-4 py-3">Lifetime XP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    return (
                      <tr
                        key={member.id}
                        className={`border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
                      >
                        <td className={`px-4 py-3 font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                          {member.name}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {member.currentXp}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {member.xp}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
