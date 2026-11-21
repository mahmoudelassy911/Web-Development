import { useState } from "react";
import MovieWatchList from "./MovieWatchList";
import CommentsSection from "./CommentsSection";

// App shows one task at a time. The buttons at the top switch between them.
export default function App() {
  const [page, setPage] = useState("movies");

  return (
    <div className="app">
      <nav className="tabs">
        <button
          className={page === "movies" ? "tab active" : "tab"}
          onClick={() => setPage("movies")}
        >
          Task 1: Movies Watch List
        </button>
        <button
          className={page === "comments" ? "tab active" : "tab"}
          onClick={() => setPage("comments")}
        >
          Task 2: Comments
        </button>
      </nav>

      {/* Conditional rendering: show only the selected task */}
      {page === "movies" ? <MovieWatchList /> : <CommentsSection />}
    </div>
  );
}
