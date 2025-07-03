import { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard";

const STATUS_OPTIONS = ["All", "Alive", "Dead", "unknown"];

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
      if (status !== "All") url += `&status=${status}`;
      if (search) url += `&name=${search}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCharacters(data.results || []);
        setTotalPages(data.info?.pages || 1);
        setCount(data.info?.count || 0);
      } else {
        setCharacters([]);
        setTotalPages(1);
        setCount(0);
      }
      setLoading(false);
    };
    fetchCharacters();
  }, [status, search, page]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <main className="container">
      <h1 className="my-4">Rick & Morty Explorer</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <select value={status} onChange={handleStatusChange} className="form-select" style={{ maxWidth: 200 }}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt === "unknown" ? "Unknown" : opt}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 300 }}
          placeholder="Search characters"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        Showing {characters.length} of {count} results
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="character-grid">
          {characters.slice(0, 10).map((char) => (
            <div key={char.id}>
              <CharacterCard character={char} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '2rem 0' }}>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </main>
  );
}
