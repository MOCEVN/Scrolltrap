'use client';

import HeaderSimple from '@/components/header-simple';
import Sidebar from '@/components/sidebar';
import { useFriends } from '@/hooks/use-friends';

export default function FriendsPage() {
  const { suggestions, addedFriends, addFriend, clearFriends, isFriendAdded } = useFriends();

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <HeaderSimple />

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
                      className="flex flex-col items-center rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
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
              <p className="mb-8 text-sm text-gray-500">
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
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-500">{friend.mutual} mutual friends</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addFriend(friend)}
                        disabled={isAdded}
                        className={`rounded px-3 py-1.5 text-sm font-medium text-white transition ${
                          isAdded
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'bg-blue-500 hover:bg-blue-600'
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
