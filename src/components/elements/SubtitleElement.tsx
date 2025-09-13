import type { SubtitleType } from "../../types/data";

type Props = {
  element: SubtitleType;
};

export default function SubtitleElement({ element }: Props) {
  return <h3 className="subtitle-element">{element.content}</h3>;
}
