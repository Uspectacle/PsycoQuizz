import Papa from "papaparse";
import type {
  TestData,
  QuizzType,
  QuestionType,
  TestType,
} from "../types/data";
import MarkdownIt from "markdown-it";
import html2pdf from "html2pdf.js";

/** Export format type */
export type ExportFormat = "pdf" | "csv" | "txt";

/**
 * Main function to export test data
 */
export async function exportTestData(
  data: TestData,
  format: ExportFormat
): Promise<void> {
  const filename = `${data.id}_${formatDate(data.date)}`;

  switch (format) {
    case "pdf":
      await exportPDF(data, filename);
      break;
    case "csv":
      exportCSV(data, filename);
      break;
    case "txt":
      exportTXT(data);
      break;
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date?: Date): string {
  if (!date) return "no_date";
  return new Date(date).toISOString().split("T")[0];
}

/**
 * Compute quiz score and interpretation
 */
function computeQuizzResult(quizz: QuizzType) {
  const answers = quizz.elements
    .filter((e): e is QuestionType => e.type === "question")
    .map(({ answer }) => answer);

  const definedAnswers = answers.filter((a) => a !== undefined);

  const score = definedAnswers.reduce((acc, a) => acc + (a ?? 0), 0);
  const max = definedAnswers.length * (quizz.scale.length - 1);
  const percent = max > 0 ? Math.round((score / max) * 100) : NaN;

  if (definedAnswers.length !== answers.length) {
    return {
      score,
      max,
      percent,
      result: `${answers.length - definedAnswers.length} réponses manquantes`,
    };
  }

  const result = quizz.scoring?.find(
    (s) => score >= s.min && score <= s.max
  )?.text;

  return { score, max, percent, result };
}

/**
 * Convert TestData to Markdown
 */
function generateMarkdown(data: TestData): string {
  let md = `# ${data.name}\n\n`;

  if (data.date) md += `**Date:** ${formatDate(data.date)}\n\n`;
  if (data.additionalText) md += `${data.additionalText}\n\n`;

  data.elements.forEach((element: TestType) => {
    switch (element.type) {
      case "title":
        md += `# ${element.content}\n\n`;
        break;
      case "subtitle":
        md += `## ${element.content}\n\n`;
        break;
      case "paragraph":
        md += `${element.content}\n\n`;
        break;
      case "input":
        md += `**${element.label}:** ${element.answer || "—"}\n\n`;
        break;
      case "quizz": {
        md += `## ${element.title}\n\n`;

        element.elements.forEach((q) => {
          if (q.type === "question") {
            const answer =
              typeof q.answer === "number"
                ? `${q.answer} (${element.scale[q.answer]})`
                : "—";
            md += `*${q.text}:* ${answer}\n\n`;
          }
        });

        const { score, max, percent, result } = computeQuizzResult(element);
        md += `**Score:** ${score} / ${max} (${percent}%)\n\n`;
        if (result) md += `${result}\n\n`;
        break;
      }
    }
  });

  return md;
}

/**
 * Export PDF via html2pdf.js (browser-friendly, preserves Markdown formatting)
 */
async function exportPDF(data: TestData, filename: string) {
  const md = generateMarkdown(data);
  const mdParser = new MarkdownIt();
  const htmlContent = mdParser.render(md);

  // Create a temporary div to render HTML
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  div.style.fontFamily = "Arial, sans-serif";
  div.style.fontSize = "12px";
  div.style.padding = "15mm"; // margin
  div.style.lineHeight = "1.5";
  div.style.color = "#000";

  document.body.appendChild(div);

  const opt = {
    margin: [15, 15, 15, 15], // top, left, bottom, right in mm
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().from(div).set(opt).save();
  document.body.removeChild(div);
}

/**
 * Export CSV with quiz results
 */
function exportCSV(data: TestData, filename: string): void {
  const rows: Record<string, string>[] = [];

  data.elements.forEach((element) => {
    switch (element.type) {
      case "input":
        rows.push({
          type: "input",
          label: element.label,
          answer: element.answer || "",
        });
        break;
      case "quizz": {
        element.elements.forEach((q) => {
          if (q.type === "question") {
            rows.push({
              type: "question",
              quizz: element.title,
              question: q.text,
              answer: typeof q.answer === "number" ? q.answer.toString() : "",
            });
          }
        });

        const { score, max, percent, result } = computeQuizzResult(element);
        rows.push({
          type: "result",
          quizz: element.title,
          score: `${score} / ${max} (${percent}%)`,
          interpretation: result || "",
        });
        break;
      }
    }
  });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  download(blob, `${filename}.csv`);
}

/**
 * Export TXT with quiz results (copied to clipboard)
 */
function exportTXT(data: TestData): void {
  const lines: string[] = [];

  lines.push(data.name);
  if (data.date) lines.push(`Date: ${formatDate(data.date)}`);
  if (data.additionalText) lines.push(data.additionalText);
  lines.push("");

  data.elements.forEach((element) => {
    switch (element.type) {
      case "title":
        lines.push(`# ${element.content}`);
        break;
      case "subtitle":
        lines.push(`## ${element.content}`);
        break;
      case "paragraph":
        lines.push(element.content);
        break;
      case "input":
        lines.push(`${element.label}: ${element.answer || "—"}`);
        break;
      case "quizz": {
        lines.push(`### ${element.title}`);
        element.elements.forEach((q) => {
          if (q.type === "question") {
            const answer =
              typeof q.answer === "number"
                ? `${q.answer} (${element.scale[q.answer]})`
                : "—";
            lines.push(`- ${q.text}: ${answer}`);
          }
        });

        const { score, max, percent, result } = computeQuizzResult(element);
        lines.push(`Score: ${score} / ${max} (${percent}%)`);
        if (result) lines.push(result);
        break;
      }
    }
    lines.push("");
  });

  navigator.clipboard.writeText(lines.join("\n"));
  alert("Answers copied to clipboard");
}

/**
 * Trigger browser download
 */
function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
