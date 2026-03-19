import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
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

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onCompleted: () => {
      navigate("/"); // volta pro login
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signup({
      variables: form,
    });
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="resident">Resident</option>
          <option value="business_owner">Business Owner</option>
          <option value="community_organizer">Community Organizer</option>
        </select>

        <button className="form-button" type="submit">
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error creating account</p>}

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;