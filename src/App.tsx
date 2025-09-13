import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import TestContainer from "./components/TestContainer";
import wurs from "./data/wurs.json";
import copeland from "./data/copeland.json";
import caars from "./data/caars.json";
import iba from "./data/iba.json";
import ibd from "./data/ibd.json";
import qep from "./data/qep.json";
import qia from "./data/qia.json";
import qec from "./data/qec.json";
import qap from "./data/qap.json";
import psi from "./data/psi.json";
import eii from "./data/eii.json";
import "./styles/globals.css";
import type { TestData } from "./types/data";

const TESTS_DATA = [
  caars,
  copeland,
  eii,
  iba,
  ibd,
  qap,
  qec,
  qep,
  qia,
  psi,
  wurs,
] as TestData[];

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);

  return (
    <BrowserRouter>
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <Navbar
          tests={TESTS_DATA}
          onToggleDark={() => setDarkMode(!darkMode)}
        />
        <main className="main">
          <Routes>
            <Route path="/" element={<p>Select a test</p>} />
            {TESTS_DATA.map((test) => (
              <Route
                path={"/" + test.id}
                element={<TestContainer test={test} />}
              />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
