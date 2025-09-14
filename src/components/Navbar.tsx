import "../styles/navbar.css";
import type { TestData } from "../types/data";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  tests: TestData[];
  onToggleDark: () => void;
};

export default function Navbar({ tests, onToggleDark }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

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
          <option value="">Séléctionner un test</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="navbar-right">
        <button onClick={onToggleDark}>
          <i className="fas fa-circle-half-stroke"></i>
        </button>
      </div>
    </nav>
  );
}
