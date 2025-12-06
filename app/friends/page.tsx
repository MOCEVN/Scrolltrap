'use client';

import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { useFriends } from '@/hooks/use-friends';
import { useScenarioMode } from '@/hooks/use-scenario-mode';

export default function FriendsPage() {
  const { suggestions, addedFriends, addFriend, clearFriends, isFriendAdded } = useFriends();

  const { isDoom } = useScenarioMode();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      isDoom ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
    }`}>
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-6" data-scroll-container>
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">Friends</h1>

            {addedFriends.length > 0 ? (
              <section className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">Your Friends</h2>
                <div className="flex flex-wrap gap-3">
                  {addedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`flex flex-col items-center rounded-xl p-3 shadow-sm transition hover:shadow-md ${
                        isDoom 
                          ? "bg-slate-800 border border-red-900/30" 
                          : "bg-white"
                      }`}
                    >
                      <div className="mb-2 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium">{friend.name.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearFriends}
                  className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Clear All Friends
                </button>
              </section>
            ) : (
              <p className={`mb-8 text-sm transition-colors duration-300 ${
                isDoom ? "text-slate-400" : "text-gray-500"
              }`}>
                You haven&apos;t added any friends yet. Start adding some!
              </p>
            )}

            <section>
              <h2 className="mb-3 text-lg font-semibold">Friend Suggestions</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((friend) => {
                  const isAdded = isFriendAdded(friend.id);

                  return (
                    <div
                      key={friend.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm transition hover:shadow-md ${
                        isDoom 
                          ? "border-red-900/30 bg-slate-800" 
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ${
                        isDoom ? "bg-slate-700" : "bg-gray-200"
                      }`}>
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{friend.name}</p>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDoom ? "text-slate-400" : "text-gray-500"
                        }`}>{friend.mutual} mutual friends</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addFriend(friend)}
                        disabled={isAdded}
                        className={`rounded px-3 py-1.5 text-sm font-medium text-white transition ${
                          isAdded
                            ? 'cursor-not-allowed bg-gray-400'
                            : isDoom 
                              ? 'bg-red-600 hover:bg-red-500' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
