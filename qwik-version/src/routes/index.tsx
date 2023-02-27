import { component$, useStore, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

const User = component$(({ user }: { user: UserData }) => {
  return (
    <div>
      {user.first_name} {user.last_name} {user.email}
    </div>
  );
});

export default component$(() => {
  const store = useStore({ filter: "" });

  const users = useSignal<UserData[]>([]);
  useTask$(async () => {
    const resp = await fetch("https://reqres.in/api/users");
    const json = await resp.json();
    users.value = json.data;
  });

  const filteredUsers = useSignal<UserData[]>([]);
  useTask$(({ track }) => {
    track(() => users.value && store.filter);
    filteredUsers.value =
      users.value?.filter(
        (user) =>
          user.first_name.includes(store.filter) ||
          user.last_name.includes(store.filter) ||
          user.email.includes(store.filter)
      ) ?? [];
  });

  return (
    <div>
      <h1>Qwik</h1>

      <input
        type="text"
        value={store.filter}
        onInput$={(e) => {
          store.filter = (e.target as HTMLInputElement).value;
        }}
      />

      <div>Filter: {store.filter}</div>

      {filteredUsers.value.map((user) => (
        <User key={user.email} user={user} />
      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Implementation",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
