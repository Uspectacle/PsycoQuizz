export type TitleType = {
  type: "title";
  content: string;
};

export type SubtitleType = {
  type: "subtitle";
  content: string;
};

export type ParagraphType = {
  type: "paragraph";
  content: string;
};

export type InputType = {
  type: "input";
  label: string;
  answer?: string;
};

export type QuestionType = {
  type: "question";
  text: string;
  answer?: number;
};

export type TextType = TitleType | SubtitleType | ParagraphType | InputType;

export type Scale = string[];

export type Scoring = {
  min: number;
  max: number;
  text: string;
};

export type QuizzType = {
  type: "quizz";
  title: string;
  scale: Scale;
  scoring?: Scoring[];
  elements: (TextType | QuestionType)[];
};

export type TestType = TextType | QuizzType;

export type TestData = {
  lang: "en" | "fr";
  documentUrl: string;
  id: string;
  name: string;
  elements: TestType[];
  additionalText?: string;
};
