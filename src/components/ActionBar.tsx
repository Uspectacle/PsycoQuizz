import type { TestData } from "../types/data";
import type { ExportFormat } from "../helpers/exportData";
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
  const handleExport = (format: ExportFormat) => {
    exportTestData(test, format);
  };

  const confirmClear = () => {
    if (window.confirm("Are you sure you want to clear all answers?")) {
      onClear();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Page link copied to clipboard");
  };

  return (
    <div className="action-bar">
      <div className="date-input">
        <label>Date:</label>
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
        <label>Additional Notes:</label>
        <textarea
          value={test.additionalText ?? ""}
          onChange={(e) => onAdditionalTextChange(e.target.value)}
          placeholder="Add any additional notes here, like your name"
        />
      </div>
      <div className="action-bar-buttons">
        <button onClick={() => handleExport("pdf")}>
          <i className="fa-solid fa-file-pdf"></i> Export Answers as PDF
        </button>
        <button onClick={() => handleExport("csv")}>
          <i className="fa-solid fa-file-csv"></i> Export Answers as CSV
        </button>
        <button onClick={() => handleExport("txt")}>
          <i className="fa-solid fa-file-export"></i> Copy Answers as Text
        </button>
      </div>
      <div className="action-bar-buttons">
        <a
          href={"documents/" + test.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <i className="fa-solid fa-file-arrow-down"></i> Original Test
            Document
          </button>
        </a>
        <button onClick={copyLink}>
          <i className="fa-solid fa-link"></i> Copy Link
        </button>
      </div>
      <div className="action-bar-buttons">
        <button onClick={confirmClear} className="danger">
          <i className="fa-solid fa-trash"></i> Clear Answers
        </button>
      </div>
    </div>
  );
}
