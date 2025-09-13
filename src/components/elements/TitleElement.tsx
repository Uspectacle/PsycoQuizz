import type { TitleType } from "../../types/data";

type Props = {
  element: TitleType;
};

export default function TitleElement({ element }: Props) {
  return <h2 className="title-element">{element.content}</h2>;
}
