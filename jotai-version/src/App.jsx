/** @jsxImportSource jotai-signal */

import { Suspense } from "react";
import { atom } from "jotai/vanilla";
import { useSetAtom, useAtom } from "jotai";
import { $ } from "jotai-signal";

const filterAtom = atom("");
const usersAtom = atom(async () => {
  const resp = await fetch("https://reqres.in/api/users");
  const json = await resp.json();
  return json.data;
});
const filteredUsersAtom = atom(async (get) => {
  const filter = get(filterAtom);
  const users = await get(usersAtom);
  return (users ?? [])?.filter?.(
    (user) =>
      user.first_name.includes(filter) ||
      user.last_name.includes(filter) ||
      user.email.includes(filter)
  );
});

function DataDisplay() {
  const [users] = useAtom(filteredUsersAtom);
  return (
    <div>
      {users.map((user) => (
        <div>
          {user.first_name} {user.last_name} {user.email}
        </div>
      ))}
    </div>
  );
}

function Filter() {
  return <div>Filter: {$(filterAtom)}</div>;
}

function App() {
  const setFilter = useSetAtom(filterAtom);

  return (
    <div>
      <h1>Jotai-Signals</h1>

      <input
        type="text"
        value={$(filterAtom)}
        onChange={(e) => setFilter(e.target.value)}
      />

      <Filter />

      <Suspense fallback={<div>Loading...</div>}>
        <DataDisplay />
      </Suspense>
    </div>
  );
}

export default App;
