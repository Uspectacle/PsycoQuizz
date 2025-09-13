import type { Scale, Scoring } from "../../types/data";

type Props = {
  scale: Scale;
  scoring?: Scoring[];
  answers: number[];
};

export default function ResultElement({ scoring, answers, scale }: Props) {
  const score = answers.reduce((acc, answer) => acc + answer, 0);
  const max = answers.length * scale.length - 1;
  const result = scoring?.find((s) => score >= s.min && score <= s.max);

  return (
    <div className="result-element">
      <h3>
        Score: {score} / {max} ({Math.round((score / max) * 100)}%)
      </h3>
      {result && <p>{result.text}</p>}
    </div>
  );
}
