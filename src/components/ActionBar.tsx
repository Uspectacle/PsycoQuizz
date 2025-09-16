import type { TestData } from "../types/data";
import { useTranslation } from "react-i18next";
import { exportJSON, exportPdfReact } from "../helpers/exportData";
import { useId } from "react";
import CopyArea from "./CopyArea";

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

  const confirmClear = () => {
    if (window.confirm(t("actions.clearConfirm"))) {
      onClear();
    }
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
      <h3>{t("actions.yourAnswers")}</h3>
      <button onClick={() => exportPdfReact(test, t)}>
        <i className="fa-solid fa-file-pdf"></i> {t("actions.exportPdfFull")}
      </button>
      <button onClick={() => exportJSON(test)}>
        <i className="fa-solid fa-file-code"></i> {t("actions.exportJson")}
      </button>

      <CopyArea test={test} />

      <button onClick={confirmClear} className="danger">
        <i className="fa-solid fa-trash"></i> {t("actions.clear")}
      </button>
    </div>
  );
}
