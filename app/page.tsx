"use client";

import { useMemo, useState } from "react";

type Member = {
  id: number;
  name: string;
  xp: number;
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

  const sortedByXp = useMemo(
    () => [...members].sort((a, b) => b.xp - a.xp),
    [],
  );

  const topFive = useMemo(() => sortedByXp.slice(0, 5), [sortedByXp]);

  const featuredMember = topFive[0];
  const level = Math.floor(featuredMember.xp / XP_PER_LEVEL) + 1;
  const xpIntoCurrentLevel = featuredMember.xp % XP_PER_LEVEL;
  const progressPercent = (xpIntoCurrentLevel / XP_PER_LEVEL) * 100;

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return sortedByXp;
    }

    return sortedByXp.filter((member) =>
      member.name.toLowerCase().includes(q),
    );
  }, [query, sortedByXp]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_#f8fafc_40%,_#e0f2fe_100%)] px-4 py-8 text-slate-900 sm:px-8">
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-amber-200/70 bg-white/85 p-6 shadow-lg shadow-amber-100 backdrop-blur-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Current Level
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Level {level}
            </h1>
            <p className="text-sm font-medium text-slate-600 sm:text-base">
              {xpIntoCurrentLevel} / {XP_PER_LEVEL} XP
            </p>
          </div>

          <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {featuredMember.name} is leading right now with {featuredMember.xp} XP.
          </p>
        </section>

        <section className="rounded-3xl border border-sky-200/80 bg-white/85 p-6 shadow-lg shadow-sky-100 backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="mt-1 text-sm text-slate-600">Top 5 members by XP</p>

          <ol className="mt-4 space-y-3">
            {topFive.map((member, index) => (
              <li
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-semibold">{member.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {member.xp} XP
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-teal-200/80 bg-white/85 p-6 shadow-lg shadow-teal-100 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Members</h2>
              <p className="mt-1 text-sm text-slate-600">
                Search members and open their details
              </p>
            </div>

            <label className="w-full sm:max-w-xs">
              <span className="sr-only">Search members</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-teal-500"
              />
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {filteredMembers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No members found for this search.
              </p>
            ) : (
              filteredMembers.map((member) => {
                const { level, currentXp } = getMemberProgress(member.xp);

                return (
                  <details
                    key={member.id}
                    className="group rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-left font-semibold">
                      <span>{member.name}</span>
                      <span className="text-sm font-medium text-slate-600">
                        Level {level}
                      </span>
                    </summary>
                    <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
                      <dl className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg bg-white px-3 py-2">
                          <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Member Name
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {member.name}
                          </dd>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Level
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">{level}</dd>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Current XP
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {currentXp} / {XP_PER_LEVEL}
                          </dd>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Lifetime XP
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {member.xp}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </details>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
