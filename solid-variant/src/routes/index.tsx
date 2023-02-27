import { createSignal, createResource, createMemo, For } from "solid-js";
import { useRouteData } from "solid-start";

const [filter, setFilter] = createSignal("");

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export function routeData() {
  const [users] = createResource<UserData[]>(async () => {
    const resp = await fetch("https://reqres.in/api/users");
    const payload = await resp.json();
    return payload.data;
  });
  return { users };
}

function User({ user }: { user: UserData }) {
  return (
    <div>
      {user.first_name} {user.last_name} {user.email}
    </div>
  );
}

export default function Home() {
  const { users } = useRouteData<typeof routeData>();

  const filteredUsers = createMemo(() =>
    (users() ?? []).filter(
      (user) =>
        user.first_name.includes(filter()) ||
        user.last_name.includes(filter()) ||
        user.email.includes(filter())
    )
  );

  return (
    <main>
      <h1>Solid Variant</h1>
      <input
        type="text"
        value={filter()}
        onInput={(e) => setFilter((e.target as HTMLInputElement).value)}
      />
      <div>Filter: {filter()}</div>

      <For each={filteredUsers()} fallback={<div>Loading...</div>}>
        {(user) => <User user={user} />}
      </For>
    </main>
  );
}
