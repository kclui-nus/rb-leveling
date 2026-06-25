"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Member = {
  id: number;
  name: string;
  lifetime_xp: number;
  current_xp: number;
};

type MemberWithProgress = Member & {
  level: number;
};

type Progress = {
  level: number;
  currentXp: number;
};

const XP_PER_LEVEL = 64;

function getAggregateProgress(totalLifetimeXp: number): Progress {
  const level = Math.floor(totalLifetimeXp / XP_PER_LEVEL) + 1;
  const currentXp = totalLifetimeXp % XP_PER_LEVEL;

  return { level, currentXp };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/members");

        if (!response.ok) {
          throw new Error(`Failed to load members: ${response.status}`);
        }

        const data = (await response.json()) as Member[];

        if (!cancelled) {
          setMembers(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load members",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  const membersWithProgress = useMemo<MemberWithProgress[]>(
    () =>
      members.map((member) => {
        const level = Math.floor(member.lifetime_xp / XP_PER_LEVEL) + 1;

        return { ...member, level };
      }),
    [members],
  );

  const totalLifetimeXp = useMemo(
    () => members.reduce((sum, member) => sum + member.lifetime_xp, 0),
    [members],
  );

  const { level, currentXp: xpIntoCurrentLevel } = useMemo(
    () => getAggregateProgress(totalLifetimeXp),
    [totalLifetimeXp],
  );

  const progressPercent = members.length
    ? (xpIntoCurrentLevel / XP_PER_LEVEL) * 100
    : 0;

  const sortedByCurrentXp = useMemo(
    () =>
      [...membersWithProgress].sort(
        (a, b) => b.current_xp - a.current_xp || b.lifetime_xp - a.lifetime_xp,
      ),
    [membersWithProgress],
  );

  const topThree = useMemo(() => sortedByCurrentXp.slice(0, 3), [sortedByCurrentXp]);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return membersWithProgress;
    }

    return membersWithProgress.filter((member) =>
      member.name.toLowerCase().includes(q),
    );
  }, [query, membersWithProgress]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const membersPerPage = 5;
  const totalMemberPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / membersPerPage),
  );

  const paginatedMembers = useMemo(
    () =>
      filteredMembers.slice(
        (currentPage - 1) * membersPerPage,
        currentPage * membersPerPage,
      ),
    [currentPage, filteredMembers],
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalMemberPages));
  }, [totalMemberPages]);

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
              <Image
                src="/card-affinity-logo.jpeg"
                alt="Card Affinity logo"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                width={56}
                height={56}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Current Level
              </p>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {isLoading ? "Loading..." : `Level ${level}`}
                </h1>
                <p className="text-sm font-medium text-slate-300 sm:text-base">
                  {isLoading ? "Fetching Neon data" : `${xpIntoCurrentLevel} / ${XP_PER_LEVEL} XP`}
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

          {error ? (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

        </section>

        <section className="rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-lg shadow-black/40 backdrop-blur-md sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>

          <div
            className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20"
          >
            {isLoading ? (
              <p className="px-4 py-4 text-sm text-slate-300">Loading leaderboard...</p>
            ) : topThree.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-300">No members found in Neon.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/10 text-xs uppercase tracking-wide text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Member Name</th>
                    <th className="px-4 py-3">Current XP</th>
                  </tr>
                </thead>
                <tbody>
                  {topThree.map((member, index) => (
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
                        {member.current_xp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-lg shadow-black/40 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Members</h2>
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
            {isLoading ? (
              <p
                className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-slate-300"
              >
                Loading members from Neon...
              </p>
            ) : filteredMembers.length === 0 ? (
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
                  {paginatedMembers.map((member) => {
                    return (
                      <tr
                        key={member.id}
                        className="border-t border-white/10"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-100">
                          {member.name}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {member.current_xp}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {member.lifetime_xp}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {filteredMembers.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-300">
                Page {currentPage} of {totalMemberPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalMemberPages, page + 1))
                  }
                  disabled={currentPage === totalMemberPages}
                  className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
