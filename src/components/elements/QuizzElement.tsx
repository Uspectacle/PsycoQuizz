import type { QuestionType, QuizzType } from "../../types/data";
import InputElement from "./InputElement";
import ParagraphElement from "./ParagraphElement";
import QuestionElement from "./QuestionElement";
import ResultElement from "./ResultElement";
import { useMemo } from "react";
import SubtitleElement from "./SubtitleElement";
import TitleElement from "./TitleElement";

type Props = {
  quizzIndex: number;
  element: QuizzType;
  onAnswer: (index: number, answer: number) => void;
  onInputAnswer: (index: number, answer: string) => void;
};

export default function QuizzElement({
  quizzIndex,
  element,
  onAnswer,
  onInputAnswer,
}: Props) {
  const { answeredCount, totalQuestions } = useMemo(() => {
    const questionElements = element.elements.filter(
      (e) => e.type === "question"
    ) as QuestionType[];
    const answered = questionElements.filter(
      (q) => q.answer !== undefined
    ).length;
    const total = questionElements.length;
    return {
      answeredCount: answered,
      totalQuestions: total,
    };
  }, [element.elements]);

  const unansweredIndex = useMemo(
    () =>
      element.elements.findIndex(
        (e) => e.type === "question" && e.answer === undefined
      ),
    [element.elements]
  );

  const scrollToQuestion = (index: number) => {
    const element = document.querySelector(
      `[data-question-index="${quizzIndex}-${index}"]`
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="quizz-element">
      <h3>{element.title}</h3>
      {element.elements.map((qElement, index) => {
        switch (qElement.type) {
          case "title":
            return <TitleElement key={index} element={qElement} />;
          case "subtitle":
            return <SubtitleElement key={index} element={qElement} />;
          case "paragraph":
            return <ParagraphElement key={index} element={qElement} />;
          case "input":
            return (
              <InputElement
                key={index}
                element={qElement}
                onAnswer={(answer) => onInputAnswer(index, answer)}
              />
            );
          case "question":
            return (
              <div key={index} data-question-index={`${quizzIndex}-${index}`}>
                <QuestionElement
                  element={qElement}
                  scale={element.scale}
                  onAnswer={(answer) => onAnswer(index, answer)}
                />
              </div>
            );
        }
      })}
      <div className="quizz-result">
        {answeredCount < totalQuestions ? (
          <div className="progress-status">
            <h4>
              Progress: {answeredCount} / {totalQuestions} questions answered
            </h4>
            {unansweredIndex >= 0 && (
              <button
                key={unansweredIndex}
                onClick={() => scrollToQuestion(unansweredIndex)}
                className="question-link"
              >
                Jump to unanswered question
              </button>
            )}
          </div>
        ) : (
          <ResultElement
            scoring={element.scoring}
            answers={element.elements
              .filter((e): e is QuestionType => e.type === "question")
              .map((q) => q.answer || 0)}
            scale={element.scale}
          />
        )}
      </div>
    </div>
  );
}
