import { EnableNotification } from "../components/client/EnableNotifications";

export default async function Home({ searchParams }: any) {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <EnableNotification />
    </main>
  );
}
