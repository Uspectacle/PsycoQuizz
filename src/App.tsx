import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import TestContainer from "./components/TestContainer";
import { useTranslation } from "react-i18next";
// Import French versions
import wursFr from "./data/wurs.json";
import copelandFr from "./data/copeland.json";
import caarsFr from "./data/caars.json";
import ibaFr from "./data/iba.json";
import ibdFr from "./data/ibd.json";
import qepFr from "./data/qep.json";
import qiaFr from "./data/qia.json";
import qecFr from "./data/qec.json";
import qapFr from "./data/qap.json";
import psiFr from "./data/psi.json";
import eiiFr from "./data/eii.json";

// Import English versions
import wursEn from "./data/wurs.en.json";
import copelandEn from "./data/copeland.en.json";
import caarsEn from "./data/caars.en.json";
import ibaEn from "./data/iba.en.json";
import ibdEn from "./data/ibd.en.json";
import qepEn from "./data/qep.en.json";
import qiaEn from "./data/qia.en.json";
import qecEn from "./data/qec.json";
import qapEn from "./data/qap.en.json";
import psiEn from "./data/psi.en.json";
import eiiEn from "./data/eii.en.json";

import "./styles/globals.css";
import type { TestData } from "./types/data";
import { useEffect, useState } from "react";

const TESTS_DATA_FR = [
  caarsFr,
  copelandFr,
  eiiFr,
  ibaFr,
  ibdFr,
  qapFr,
  qecFr,
  qepFr,
  qiaFr,
  psiFr,
  wursFr,
] as TestData[];

const TESTS_DATA_EN = [
  caarsEn,
  copelandEn,
  eiiEn,
  ibaEn,
  ibdEn,
  qapEn,
  qecEn,
  qepEn,
  qiaEn,
  psiEn,
  wursEn,
] as TestData[];

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);
  const { t, i18n } = useTranslation();
  const [tests, setTests] = useState<TestData[]>(TESTS_DATA_EN);

  useEffect(
    () => setTests(i18n.language === "fr" ? TESTS_DATA_FR : TESTS_DATA_EN),
    [i18n.language]
  );

  return (
    <HashRouter>
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <Navbar tests={tests} onToggleDark={() => setDarkMode(!darkMode)} />
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={
                <p className="paragraph-element">{t("navigation.home")}</p>
              }
            />
            {tests.map((test) => (
              <Route
                key={test.id}
                path={"/" + test.id}
                element={<TestContainer test={test} />}
              />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
