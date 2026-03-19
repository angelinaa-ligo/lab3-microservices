import Navbar from "authApp/Navbar";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_POSTS, GET_HELP_REQUESTS } from "../apollo/queries";
import {
  CREATE_POST,
  CREATE_HELP_REQUEST,
  RESOLVE_HELP_REQUEST,
} from "../apollo/mutations";
import { useState } from "react";

function Home() {
    const userRole = localStorage.getItem("role");
  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "network-only",
  });

  const { data: helpData, refetch: refetchHelp } =
    useQuery(GET_HELP_REQUESTS, {
      fetchPolicy: "network-only",
    });

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [createHelpRequest] = useMutation(CREATE_HELP_REQUEST);
  const [resolveHelpRequest] = useMutation(RESOLVE_HELP_REQUEST);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("discussion");

  const [createPost] = useMutation(CREATE_POST);

  // 🔥 CREATE POST (VALIDAÇÃO VIA BACKEND)
  const handleCreate = async () => {
    try {
      await createPost({
        variables: { title, content, category },
      });

      setTitle("");
      setContent("");
      setCategory("discussion");

      refetch();
    } catch (err) {
      alert(
        "You must be logged in to create a post. Please sign in and try again."
      );
    }
  };

  // 🔥 HELP REQUEST (VALIDAÇÃO VIA BACKEND)
  const handleHelpRequest = async () => {
    try {
      await createHelpRequest({
        variables: { description, location },
      });

      setDescription("");
      setLocation("");

      refetchHelp();
    } catch (err) {
      alert(
        "You must be logged in to request help. Please sign in and try again."
      );
    }
  };

  const formatTime = () => "";

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (error) return <p>Error loading posts</p>;

  return (
    <>
      <Navbar showBack={true} />

      <div className="forum-layout">
        {/* FEED */}
        <div className="feed">
          <h2>🌐 Community Forum</h2>

          <div className="create-post">
            <input
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="post-actions">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="discussion">💬 Discussion</option>
                <option value="news">📰 News</option>
              </select>

              <button onClick={handleCreate}>Post</button>
            </div>
          </div>

          {data.posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="avatar">
                  {post.authorName?.charAt(0) || "U"}
                </div>

                <div>
                  <strong>{post.authorName || "Unknown"}</strong>
                  <span className="role">  {post.authorRole}</span>
                  <small>{formatTime()}</small>
                </div>
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              <div className="post-footer">
                <span className="category">{post.category}</span>

                <div className="actions">
                  <button>👍 Like</button>
                  <button>💬 Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>🆘 Help Requests</h3>

          <div className="help-form">
            <input
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button onClick={handleHelpRequest}>
              Request Help
            </button>
          </div>

          {helpData?.helpRequests.map((req) => (
            <div
              key={req.id}
              className={`help-card ${
                req.isResolved ? "resolved" : ""
              }`}
            >
              <p>{req.description}</p>
              <small>📍 {req.location || "No location"}</small>

              <div className="status">
                {req.isResolved ? "✅ Resolved" : "⏳ Pending"}
              </div>

              {!req.isResolved && (
  <button
    onClick={async () => {
      // 🚫 BLOQUEIO FRONT
      if (userRole === "resident") {
        alert("not allowed to mark requests as resolved.");
        return;
      }

      try {
        await resolveHelpRequest({
          variables: { id: req.id },
        });

        refetchHelp();
      } catch (err) {
        alert("not allowed to mark requests as resolved");
      }
    }}
  >
    Mark as Resolved
  </button>
)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;