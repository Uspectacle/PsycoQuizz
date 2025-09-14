import type { QuestionType } from "../../types/data";

type Props = {
  element: QuestionType;
  scale: string[];
  onAnswer: (answer: number) => void;
};

export default function QuestionElement({ element, scale, onAnswer }: Props) {
  return (
    <div className="question-element">
      <label>{element.text}</label>
      <div className="scale-wrapper">
        <input
          type="range"
          min={0}
          max={scale.length - 1}
          step={1}
          value={element.answer ?? 0}
          onChange={(e) => onAnswer(parseInt(e.target.value))}
          onClick={(e) => {
            if (element.answer === undefined) {
              onAnswer(parseInt((e.target as HTMLInputElement).value));
            }
          }}
          onTouchEnd={(e) => {
            if (element.answer === undefined) {
              onAnswer(parseInt((e.target as HTMLInputElement).value));
            }
          }}
          list={`tick-${element.text}`}
        />
        <datalist id={`tick-${element.text}`}>
          {scale.map((_label, idx) => (
            <option key={idx} value={idx} />
          ))}
        </datalist>
      </div>
      <span>{element.answer !== undefined ? scale[element.answer] : "—"}</span>
    </div>
  );
}
