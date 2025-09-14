import type { InputType } from "../../types/data";
import { useTranslation } from "react-i18next";

type Props = {
  element: InputType;
  onAnswer: (answer: string) => void;
};

export default function InputElement({ element, onAnswer }: Props) {
  const { t } = useTranslation();
  return (
    <div className="input-element">
      <label>{element.label}</label>
      <input
        type="text"
        value={element.answer ?? ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder={t("input.placeholder")}
      />
    </div>
  );
}
