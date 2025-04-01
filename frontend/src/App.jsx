import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard"; // Make sure this file exists
import LandingPage from "./pages/LandingPage";
import Select from "./pages/select";
import OnboardingGenres from "./pages/OnboardingGenres";
import AI from "./pages/AI";
import BookTracker from "./pages/BookTracker";
import Genres from "./pages/Genres";
import BookDetails from "./pages/BookDetails";
import SearchResults from "./pages/SearchResults";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/landing-page" element={<LandingPage/>} />
        <Route path="/Select" element={<Select/>} />
        <Route path="/onboarding-genres" element={<OnboardingGenres />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/ai-search" element={<AI />}/>
        <Route path="/book-tracker" element={<BookTracker/>} />
        <Route path="/genres" element={<Genres/>} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
