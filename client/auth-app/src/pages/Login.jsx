import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
  const token = data.login.token;
  const role = data.login.user.role;

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  navigate("/dashboard");
}
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      variables: { email, password },
    });
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="form-button" type="submit">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Invalid credentials</p>}

      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;