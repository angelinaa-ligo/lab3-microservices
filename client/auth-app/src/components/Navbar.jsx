import { useNavigate } from "react-router-dom";

function Navbar({ showBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    window.location.href = "http://localhost:4173/dashboard";
  };

  const handleLogout = async () => {
    try {
      // 🔥 chama logout direto via fetch (SEM Apollo)
      await fetch("http://localhost:4001/graphql", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation { logout }`,
        }),
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("http://localhost:4173/");
  };

  return (
    <div style={{
      background: "#141414",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{ color: "#e50914" }}>
        Community App
      </h2>

      <div>
        {showBack && (
          <button onClick={handleBack}>
            Back
          </button>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;