import { useId } from "react";
import type { InputType } from "../../types/data";
import { useTranslation } from "react-i18next";

type Props = {
  element: InputType;
  onAnswer: (answer: string) => void;
};

export default function InputElement({ element, onAnswer }: Props) {
  const { t } = useTranslation();
  const inputId = useId();

  return (
    <div className="input-element">
      <label htmlFor={inputId}>{element.label}</label>
      <input
        id={inputId}
        type="text"
        value={element.answer ?? ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder={t("input.placeholder")}
      />
    </div>
  );
}
