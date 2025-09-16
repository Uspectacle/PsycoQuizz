import { useState } from "react";
import "../styles/copyArea.css";
import { useTranslation } from "react-i18next";
import { generateTextResults } from "../helpers/exportData";
import type { TestData } from "../types/data";

interface CopyAreaProps {
  test: TestData;
}

export default function CopyArea({ test }: CopyAreaProps) {
  const { t } = useTranslation();

  const [textCopied, setTextCopied] = useState(false);
  const [reduced, setReduced] = useState(false);

  const text = generateTextResults(test, t, reduced);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 1500);
    });
  };

  return (
    <div className="copy-area-container">
      <textarea value={text} readOnly className="copy-area" />
      <button
        className={`copy-button ${textCopied ? "copied" : ""}`}
        onClick={copyToClipboard}
      >
        <i className="fa-solid fa-copy" />
        {textCopied ? t("actions.copied") : t("actions.copy")}
      </button>
      <button
        className="reduce-toggle"
        onClick={() => setReduced((red) => !red)}
      >
        <i className={`fa-solid fa-toggle-${reduced ? "on" : "off"}`} />
        {reduced ? t("actions.resultOnly") : t("actions.fullReport")}
      </button>
    </div>
  );
}
