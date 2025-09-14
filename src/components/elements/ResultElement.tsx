import type { Scale, Scoring } from "../../types/data";
import { useTranslation } from "react-i18next";

type Props = {
  scale: Scale;
  scoring?: Scoring[];
  answers: number[];
};

export default function ResultElement({ scoring, answers, scale }: Props) {
  const { t } = useTranslation();
  const score = answers.reduce((acc, answer) => acc + answer, 0);
  const max = answers.length * scale.length - 1;
  const result = scoring?.find((s) => score >= s.min && score <= s.max);
  const percentage = Math.round((score / max) * 100);

  return (
    <div className="result-element">
      <h3>{t("result.score", { score, max, percentage })}</h3>
      {result && <p>{result.text}</p>}
    </div>
  );
}
