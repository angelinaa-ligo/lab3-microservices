import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../apollo/queries";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function Dashboard() {
  const { data, loading, error } = useQuery(GET_ME);
  const navigate = useNavigate();
 const goToCommunity = () => {
    window.location.href = "http://localhost:3001";
  };
  if (loading) return <p>Loading...</p>;
const token = localStorage.getItem("token");
if (!token) {
      navigate("/");
    }
  if (error) {
  return (
    <div className="container">
      <h2>Not authenticated</h2>
      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
}


  return (

    <>
  <Navbar showBack={false} />
  <div className="container">
    <h1>Welcome</h1>
    <p>Username: {data.me.username}</p>
    <p>Email: {data.me.email}</p>
    <p>Role: {data.me.role}</p>
    <button
        onClick={goToCommunity}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Community
      </button>
  </div>
  
</>
    
  );
}

export default Dashboard;