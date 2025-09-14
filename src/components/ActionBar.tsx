import type { TestData } from "../types/data";
import type { ExportFormat } from "../helpers/exportData";
import { useTranslation } from "react-i18next";
import { exportTestData } from "../helpers/exportData";

type Props = {
  test: TestData;
  onDateChange: (date: Date) => void;
  onAdditionalTextChange: (text: string) => void;
  onClear: () => void;
};

export default function ActionBar({
  test,
  onDateChange,
  onAdditionalTextChange,
  onClear,
}: Props) {
  const { t } = useTranslation();

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
      <div className="date-input">
        <label>{t("actions.date")}:</label>
        <input
          type="date"
          value={
            test.date
              ? new Date(test.date).toISOString().split("T")[0]
              : undefined
          }
          onChange={(e) => onDateChange(new Date(e.target.value))}
        />
      </div>
      <div className="additional-text">
        <label>{t("actions.additionalNotes")}:</label>
        <textarea
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
