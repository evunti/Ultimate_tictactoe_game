import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { GameBoard } from "./GameBoard";
import { Doc } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Tic Tac Toe</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser) as
    | Doc<"users">
    | null
    | undefined;
  const games = useQuery(api.games.listGames);
  const createGame = useMutation(api.games.createGame);
  const otherUsers = useQuery(api.users.list) as Doc<"users">[] | undefined;

  if (loggedInUser === undefined || otherUsers === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">Tic Tac Toe</h1>
        <Authenticated>
          <p className="text-xl text-slate-600">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
          <div className=" bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 space-y-2 flex flex-col items-start">
              {" "}
              {/* Updated to use flex */}
              <h3 className="font-semibold text-base text-black">
                How to Play Ultimate Tic Tac Toe:
              </h3>
              <p>1. Win small boards to claim them in the big game</p>
              <p>
                2. Your move determines which board your opponent must play in
                next
              </p>
              <p>3. Win three small boards in a row to win the game!</p>
            </div>
          </div>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to play</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Start a New Game</h3>
            <div className="flex flex-wrap gap-2">
              {otherUsers
                .filter((user) => user._id !== loggedInUser?._id)
                .map((user) => (
                  <button
                    key={user._id}
                    onClick={() => createGame({ otherPlayerId: user._id })}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  >
                    Play with {user.email}
                  </button>
                ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-semibold">Your Games</h3>
            {games?.length === 0 ? (
              <div className="text-center text-slate-600">No games yet</div>
            ) : (
              <div className="space-y-8">
                {games?.map((game) => (
                  <GameBoard key={game._id} gameId={game._id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Authenticated>
    </div>
  );
}
