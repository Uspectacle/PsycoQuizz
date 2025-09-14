import "../styles/navbar.css";
import type { TestData } from "../types/data";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  tests: TestData[];
  onToggleDark: () => void;
};

export default function Navbar({ tests, onToggleDark }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(nextLang);
  };

  const goToTest = (id: string) => {
    if (id) {
      navigate(`/${id}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <select
          value={location.pathname.substring(1) || ""}
          onChange={(e) => goToTest(e.target.value)}
        >
          <option value="">{t("navigation.selectTest")}</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="navbar-right">
        <button onClick={toggleLanguage} title={t("language.switch")}>
          <i className={`fi ${t("navigation.flag")}`}></i>
        </button>
        <button onClick={onToggleDark} title={t("theme.toggle")}>
          <i className="fas fa-circle-half-stroke"></i>
        </button>
      </div>
    </nav>
  );
}
