import type { InputType } from "../../types/data";

type Props = {
  element: InputType;
  onAnswer: (answer: string) => void;
};

export default function InputElement({ element, onAnswer }: Props) {
  return (
    <div className="input-element">
      <label>{element.label}</label>
      <input
        type="text"
        value={element.answer ?? ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Your answer here..."
      />
    </div>
  );
}
