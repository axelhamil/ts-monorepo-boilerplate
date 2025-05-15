import { getUser } from "@data-access/queries/getUser";
import { format } from "@packages/libs";
import type { ReactNode } from "react";

export default async function Home(): Promise<ReactNode> {
  const { data: user, status } = await getUser();

  const serverOK = status === 200;

  if (!user) {
    return <div>User not found</div>;
  }

  if (!serverOK) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-4xl mb-4">🔌</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Serveur inaccessible
        </h2>
        <p className="text-gray-600">
          Veuillez vérifier que le serveur est en cours d'exécution.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Next.js Boilerplate
        </h1>
        <p className="text-xl text-gray-600">
          Un point de départ moderne et optimisé pour vos applications Next.js
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <a
            href="https://nextjs.org/docs"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation Next.js
          </a>
          <a
            href="https://github.com/axelhamil/ts-monorepo-boilerplate"
            className="px-6 py-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code Source
          </a>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xl text-white">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 rounded p-4 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-700">ID:</span>
                <code className="px-2 py-1 bg-white rounded border">
                  {user.id}
                </code>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-700">Créé le:</span>
                <time>{format(user.createdAt, "dd/MM/yyyy HH:mm")}</time>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-700">Mis à jour le:</span>
                <time>{format(user.updatedAt, "dd/MM/yyyy HH:mm")}</time>
              </div>
            </div>

            {serverOK ? (
              <p className="flex items-center gap-2 text-sm text-green-600">
                <span>✅</span>
                Le serveur est accessible
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-red-600">
                <span>❌</span>
                Le serveur n'est pas accessible
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
