import type { ParagraphType } from "../../types/data";

type Props = {
  element: ParagraphType;
};

export default function ParagraphElement({ element }: Props) {
  return <p className="paragraph-element">{element.content}</p>;
}
