"use client";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useCallback, useState } from "react";

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($email: String!, $name: String!) {
    createUser(email: $email, name: $name) {
      email
      name
    }
  }
`;

const GET_USERS_QUERY = gql`
  query GetUsers($id: Int!) {
    user(id: $id) {
      email
      name
    }
  }
`;

const USER_ADDED = gql`
  subscription {
    userAdded {
      email
      name
    }
  }
`;

export default function Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState(1);
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const { data: eventData, loading: eventLoading } =
    useSubscription(USER_ADDED);

  const { loading, error, data } = useQuery(GET_USERS_QUERY, {
    variables: { id },
  });

  const handleCreateUser = useCallback(async () => {
    try {
      await createUser({
        variables: {
          email,
          name,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [createUser, email, name]);

  return (
    <div>
      <br />
      id:{" "}
      <input
        type="number"
        defaultValue={1}
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
      />{" "}
      is {loading ? "loading..." : error ? error.message : JSON.stringify(data)}
      <br />
      {/* inputの前に項目名つける */}
      email:{" "}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      name:{" "}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <button onClick={handleCreateUser}>Create User</button>
      <br />
      <br />
      {eventData ? (
        <p>
          Event occurred: {eventData.userAdded.email}, Name:{" "}
          {eventData.userAdded.name}
        </p>
      ) : null}
    </div>
  );
}
