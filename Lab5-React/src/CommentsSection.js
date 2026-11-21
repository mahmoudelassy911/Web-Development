import { useState } from "react";

// One comment: avatar circle + name + text + like button
function Comment({ comment, onLike }) {
  return (
    <li className="comment">
      <div className="avatar">{comment.name[0].toUpperCase()}</div>
      <div className="bubble">
        <strong>{comment.name}</strong>
        <p>{comment.text}</p>
        <button
          className={comment.liked ? "like liked" : "like"}
          onClick={() => onLike(comment.id)}
        >
          ♥ {comment.likes}
        </button>
      </div>
    </li>
  );
}

export default function CommentsSection() {
  const [comments, setComments] = useState([
    { id: 1, name: "Sara", text: "Great explanation of components!", likes: 5, liked: false },
    { id: 2, name: "Omar", text: "Props finally make sense to me.", likes: 2, liked: false },
    { id: 3, name: "Ali", text: "Can we do a lab on useState next week?", likes: 7, liked: false },
  ]);
  const [text, setText] = useState("");
  const [nextId, setNextId] = useState(4);

  function handlePost() {
    if (text.trim() === "") return;
    const newComment = { id: nextId, name: "You", text: text.trim(), likes: 0, liked: false };
    setComments([...comments, newComment]);
    setNextId(nextId + 1);
    setText("");
  }

  // Click once to like, click again to unlike
  function handleLike(id) {
    setComments(
      comments.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  }

  return (
    <div className="card">
      <h2>Comments ({comments.length})</h2>

      <div className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePost();
          }}
        />
        <button className="btn" onClick={handlePost}>
          Post
        </button>
      </div>

      <ul className="comment-list">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} onLike={handleLike} />
        ))}
      </ul>
    </div>
  );
}
