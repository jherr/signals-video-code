import { computed, signal } from "@preact/signals-react";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

const filter = signal("");
const users = signal<UserData[]>([]);
const filteredUsers = computed(
  () =>
    (users.value ?? []).filter(
      (user) =>
        user.first_name.includes(filter.value) ||
        user.last_name.includes(filter.value) ||
        user.email.includes(filter.value)
    ) ?? []
);

fetch("https://reqres.in/api/users")
  .then((resp) => resp.json())
  .then((json) => {
    users.value = json.data;
  });

function User({ first_name, last_name, email }: UserData) {
  return (
    <div>
      {first_name} {last_name} {email}
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Preact-Signals</h1>

      <input
        type="text"
        value={filter.value}
        onChange={(e) => (filter.value = e.target.value)}
      />
      <div>Filter: {filter.value}</div>

      {filteredUsers.value.map((user) => (
        <User key={user.email} {...user} />
      ))}
    </div>
  );
}

export default App;
