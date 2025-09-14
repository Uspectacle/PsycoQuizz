import { useTranslation } from "react-i18next";
import "../styles/footer.css";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <p>2025 PsycoQuizz</p>
      <a
        href="https://github.com/Uspectacle/psyco-quizz"
        target="_blank"
        rel="noopener noreferrer"
        title={t("footer.githubLink")}
      >
        <i className="fab fa-github"></i>
      </a>
      <p>{t("footer.license")}</p>
    </footer>
  );
}
