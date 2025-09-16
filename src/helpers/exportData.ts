import { pdf } from "@react-pdf/renderer";
import type { TestData, QuizzType, QuestionType } from "../types/data";
import { type TFunction } from "i18next";
import TestDocument from "../components/TestDocument";

function getFileName(data: TestData) {
  return `${data.id}_${getDate(data.lang).replaceAll("/", "_")}`;
}

// Export PDF using React-PDF
export async function exportPdfReact(data: TestData, t: TFunction) {
  const link = document.createElement("a");
  const blob = await pdf(TestDocument({ data, t })).toBlob();
  link.href = URL.createObjectURL(blob);
  link.download = `${getFileName(data)}.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Utility: get date string
export function getDate(lang: "en" | "fr"): string {
  return new Date().toLocaleDateString(lang);
}

// Reuse your existing computeQuizzResult
export function computeQuizzResult(quizz: QuizzType, t: TFunction) {
  const answers = quizz.elements
    .filter((e): e is QuestionType => e.type === "question")
    .map(({ answer }) => answer);

  const definedAnswers = answers.filter((a) => a !== undefined);
  const score = definedAnswers.reduce((acc, a) => acc + (a ?? 0), 0);
  const max = definedAnswers.length * (quizz.scale.length - 1);
  const percent = max > 0 ? Math.round((score / max) * 100) : NaN;

  if (definedAnswers.length !== answers.length) {
    const count = answers.length - definedAnswers.length;
    return {
      score,
      max,
      percent,
      result: t("export.missing_answers", { count }),
    };
  }

  const result = quizz.scoring?.find(
    (s) => score >= s.min && score <= s.max
  )?.text;
  return { score, max, percent, result };
}

/**
 * Export JSON
 */
export function exportJSON(data: TestData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${getFileName(data)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate text representations
 */
export function generateTextResults(
  data: TestData,
  t: TFunction,
  reduced = false
): string {
  const lines: string[] = [];
  lines.push();
  lines.push(`${data.name}\n${t("export.date_label")} ${getDate(data.lang)}`);

  data.elements.forEach((element) => {
    switch (element.type) {
      case "title":
        if (!reduced) lines.push(`# ${element.content}`);
        break;
      case "subtitle":
        if (!reduced) lines.push(`## ${element.content}`);
        break;
      case "paragraph":
        if (!reduced) lines.push(element.content);
        break;
      case "input":
        if (!reduced)
          lines.push(`${element.label}\n> ${element.answer || "—"}`);
        break;
      case "quizz": {
        if (element.title) lines.push(`### ${element.title}`);
        if (!reduced) {
          element.elements.forEach((q) => {
            if (q.type === "question") {
              const answer =
                typeof q.answer === "number"
                  ? `${q.answer} (${element.scale[q.answer]})`
                  : "—";
              lines.push(`- ${q.text}\n> ${answer}`);
            }
          });
        }
        const { score, max, percent, result } = computeQuizzResult(element, t);
        lines.push(
          `>>> Score: ${score} / ${max} (${percent}%)${
            result ? " - " + result : ""
          }`
        );
        break;
      }
    }
  });

  lines.push(t("common.disclaimer"));
  if (data.additionalText)
    lines.push(`${t("common.additional_info")}\n${data.additionalText}`);
  return lines.join("\n\n");
}
