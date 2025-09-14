import type { TestData } from "../types/data";
import type { ExportFormat } from "../helpers/exportData";
import { useTranslation } from "react-i18next";
import { exportTestData } from "../helpers/exportData";
import { useId } from "react";

type Props = {
  test: TestData;
  onAdditionalTextChange: (text: string) => void;
  onClear: () => void;
};

export default function ActionBar({
  test,
  onAdditionalTextChange,
  onClear,
}: Props) {
  const { t } = useTranslation();
  const inputId = useId();

  const handleExport = (format: ExportFormat) => {
    exportTestData(test, format, t);
  };

  const confirmClear = () => {
    if (window.confirm(t("actions.clearConfirm"))) {
      onClear();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t("actions.linkCopied"));
  };

  return (
    <div className="action-bar">
      <div className="additional-text">
        <label htmlFor={inputId}>{t("actions.additionalNotes")}:</label>
        <textarea
          id={inputId}
          value={test.additionalText ?? ""}
          onChange={(e) => onAdditionalTextChange(e.target.value)}
          placeholder={t("actions.notesPlaceholder")}
        />
      </div>
      <div className="action-bar-buttons">
        <button onClick={() => handleExport("pdf")}>
          <i className="fa-solid fa-file-pdf"></i> {t("actions.exportPdf")}
        </button>
        <button onClick={() => handleExport("csv")}>
          <i className="fa-solid fa-file-csv"></i> {t("actions.exportCsv")}
        </button>
        <button onClick={() => handleExport("txt")}>
          <i className="fa-solid fa-file-export"></i> {t("actions.exportText")}
        </button>
      </div>
      <div className="action-bar-buttons">
        <a
          href={"documents/" + test.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <i className="fa-solid fa-file-arrow-down"></i>{" "}
            {t("actions.originalDoc")}
          </button>
        </a>
        <button onClick={copyLink}>
          <i className="fa-solid fa-link"></i> {t("actions.copyLink")}
        </button>
      </div>
      <div className="action-bar-buttons">
        <button onClick={confirmClear} className="danger">
          <i className="fa-solid fa-trash"></i> {t("actions.clear")}
        </button>
      </div>
    </div>
  );
}
