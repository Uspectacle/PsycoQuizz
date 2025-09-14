import { useTranslation } from "react-i18next";
import "../styles/footer.css";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <a
        href="https://github.com/Uspectacle/psyco-quizz/blob/master/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("footer.license")}
      </a>
      <a
        href="https://github.com/Uspectacle/psyco-quizz"
        target="_blank"
        rel="noopener noreferrer"
        title={t("footer.githubLink")}
      >
        <i className="fab fa-github"></i>
      </a>
      <a
        href="https://github.com/Uspectacle/psyco-quizz/issues/new"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("footer.githubIssue")}
      </a>
    </footer>
  );
}
