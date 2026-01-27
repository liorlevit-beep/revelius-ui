import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Solutions from "./pages/Solutions";
import SolutionsFintechs from "./pages/SolutionsFintechs";
import SolutionsMerchants from "./pages/SolutionsMerchants";
import NetworkPage from "./pages/NetworkPage";
import SecurityPage from "./pages/SecurityPage";
import Docs from "./pages/Docs";
import Company from "./pages/Company";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SignIn from "./pages/SignIn";
import RequestAccess from "./pages/RequestAccess";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/fintechs" element={<SolutionsFintechs />} />
            <Route
              path="/solutions/merchants"
              element={<SolutionsMerchants />}
            />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/company" element={<Company />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
