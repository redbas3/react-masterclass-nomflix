import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/react-masterclass-nomflix" element={<Home />} />
        <Route
          path="/react-masterclass-nomflix/movies/:movieId"
          element={<Home />}
        />
        <Route path="/react-masterclass-nomflix/tv" element={<Tv />} />
        <Route path="/react-masterclass-nomflix/tv/:tvId" element={<Tv />} />
        <Route path="/react-masterclass-nomflix/search" element={<Search />} />
        <Route
          path="/react-masterclass-nomflix/search/:id"
          element={<Search />}
        />
      </Routes>
    </Router>
  );
}

export default App;
