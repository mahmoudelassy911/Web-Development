import { useState } from "react";

// ---------- Small reusable components ----------

// Clickable stars (1 to 5). Used in the form AND on every movie card.
// Props: rating (number), onChange (function that receives the new rating)
function StarPicker({ rating, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-picker">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={star <= rating ? "star filled" : "star"}
          onClick={() => onChange(star)}
          title={star + " star(s)"}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Shows the rating as emojis, e.g. 3 -> ⭐⭐⭐ (3/5)
function StarEmojis({ rating }) {
  if (rating === 0) {
    return <span className="muted">Not rated yet</span>;
  }
  return (
    <span className="emojis">
      {"⭐".repeat(rating)} <span className="muted">({rating}/5)</span>
    </span>
  );
}

// One movie in the list
function MovieCard({ movie, onRemove, onRate, onSaveComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(movie.comment);

  function handleSave() {
    onSaveComment(movie.id, draft.trim());
    setIsEditing(false);
  }

  return (
    <li className="movie-card">
      <div className="movie-header">
        <h3>{movie.title}</h3>
        <button className="btn danger" onClick={() => onRemove(movie.id)}>
          Remove
        </button>
      </div>

      <StarEmojis rating={movie.rating} />
      <StarPicker
        rating={movie.rating}
        onChange={(newRating) => onRate(movie.id, newRating)}
      />

      {isEditing ? (
        <div className="edit-box">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your review..."
          />
          <div className="row">
            <button className="btn" onClick={handleSave}>
              Save
            </button>
            <button className="btn light" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="review">
          {movie.comment ? (
            <p>“{movie.comment}”</p>
          ) : (
            <p className="muted">No review yet.</p>
          )}
          <button
            className="btn light small"
            onClick={() => {
              setDraft(movie.comment);
              setIsEditing(true);
            }}
          >
            {movie.comment ? "Edit review" : "Add review"}
          </button>
        </div>
      )}
    </li>
  );
}

// ---------- Main component ----------

export default function MovieWatchList() {
  // The list of movies. Each movie: { id, title, rating, comment }
  const [movies, setMovies] = useState([
    { id: 1, title: "Inception", rating: 5, comment: "Mind-blowing story." },
    { id: 2, title: "The Lion King", rating: 4, comment: "" },
  ]);
  const [nextId, setNextId] = useState(3);

  // Form state
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleAdd(e) {
    e.preventDefault(); // stop the form from reloading the page
    if (title.trim() === "") return;

    const newMovie = {
      id: nextId,
      title: title.trim(),
      rating: rating,
      comment: comment.trim(),
    };
    setMovies([...movies, newMovie]); // make a NEW array, don't change the old one
    setNextId(nextId + 1);

    // clear the form
    setTitle("");
    setRating(0);
    setComment("");
  }

  function handleRemove(id) {
    setMovies(movies.filter((m) => m.id !== id));
  }

  function handleRate(id, newRating) {
    setMovies(movies.map((m) => (m.id === id ? { ...m, rating: newRating } : m)));
  }

  function handleSaveComment(id, newComment) {
    setMovies(movies.map((m) => (m.id === id ? { ...m, comment: newComment } : m)));
  }

  return (
    <div className="card">
      <h1>🎬 My Movies Watch List</h1>

      <form className="movie-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row">
          <span>Your rating:</span>
          <StarPicker rating={rating} onChange={setRating} />
        </div>
        <textarea
          placeholder="Write a short review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn" type="submit">
          Add movie
        </button>
      </form>

      <h2>Watched ({movies.length})</h2>

      {movies.length === 0 ? (
        <p className="muted">Your list is empty. Add a movie above!</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={handleRemove}
              onRate={handleRate}
              onSaveComment={handleSaveComment}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
