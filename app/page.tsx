"use client";

import { useMemo, useState } from "react";

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

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 text-slate-100 sm:px-8">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/rb-background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/55" />
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-lg shadow-black/40 backdrop-blur-md sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-slate-950/90 p-2 shadow-lg shadow-black/40 sm:h-[4.5rem] sm:w-[4.5rem]">
              <img
                src="/card-affinity-logo.jpeg"
                alt="Card Affinity logo"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Current Level
              </p>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Level {level}
                </h1>
                <p className="text-sm font-medium text-slate-300 sm:text-base">
                  {xpIntoCurrentLevel} / {XP_PER_LEVEL} XP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

        </section>

        <section className="rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-lg shadow-black/40 backdrop-blur-md sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="mt-1 text-sm text-slate-300">Top 5 members by current XP</p>

          <div
            className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20"
          >
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/10 text-xs uppercase tracking-wide text-slate-200">
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
                    className="border-t border-white/10"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {member.currentXp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-lg shadow-black/40 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Members</h2>
              <p className="mt-1 text-sm text-slate-300">Search members and view stats in a table</p>
            </div>

            <label className="w-full sm:max-w-xs">
              <span className="sr-only">Search members</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name"
                className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-400"
              />
            </label>
          </div>

          <div
            className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/20"
          >
            {filteredMembers.length === 0 ? (
              <p
                className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-slate-300"
              >
                No members found for this search.
              </p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/10 text-xs uppercase tracking-wide text-slate-200">
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
                        className="border-t border-white/10"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-100">
                          {member.name}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {member.currentXp}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
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
