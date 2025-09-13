import type { TestData, TestType } from "../types/data";
import { useEffect, useState } from "react";
import { loadTestData, saveTestData } from "../helpers/testData";
import ActionBar from "./ActionBar";
import "../styles/elements.css";
import TitleElement from "./elements/TitleElement";
import InputElement from "./elements/InputElement";
import ParagraphElement from "./elements/ParagraphElement";
import QuizzElement from "./elements/QuizzElement";
import SubtitleElement from "./elements/SubtitleElement";

type Props = {
  test: TestData;
};

export default function TestContainer({ test: initialTest }: Props) {
  const [test, setTest] = useState<TestData>(() => {
    const savedTest = loadTestData(initialTest.id);
    return savedTest || initialTest;
  });

  useEffect(() => {
    const savedTest = loadTestData(initialTest.id);
    setTest(savedTest || initialTest);
  }, [initialTest]);

  useEffect(() => {
    saveTestData(test);
  }, [test]);

  const handleInputAnswer = (
    index: number,
    answer: string,
    quizzIndex?: number
  ) => {
    setTest((prev: TestData) => {
      const newElements = [...prev.elements];
      const element = newElements[index];
      if (quizzIndex !== undefined && element.type === "quizz") {
        // Handle input inside quizz
        const newQuestions = [...element.elements];
        const input = newQuestions[quizzIndex];
        if (input.type === "input") {
          newQuestions[quizzIndex] = { ...input, answer };
        }
        newElements[index] = {
          ...element,
          elements: newQuestions,
        };
      } else if (element.type === "input") {
        // Handle regular input
        newElements[index] = { ...element, answer };
      }
      return { ...prev, elements: newElements };
    });
  };

  const handleQuizzAnswer = (
    elementIndex: number,
    questionIndex: number,
    answer: number
  ) => {
    setTest((prev: TestData) => {
      const newElements = [...prev.elements];
      const element = newElements[elementIndex];
      if (element.type === "quizz") {
        const newQuestions = [...element.elements];
        const question = newQuestions[questionIndex];
        if (question.type === "question") {
          newQuestions[questionIndex] = { ...question, answer };
        }
        newElements[elementIndex] = {
          ...element,
          elements: newQuestions,
        };
      }
      return { ...prev, elements: newElements };
    });
  };

  const handleDateChange = (date: Date) => {
    setTest((prev: TestData) => ({ ...prev, date }));
  };

  const handleAdditionalTextChange = (additionalText: string) => {
    setTest((prev: TestData) => ({ ...prev, additionalText }));
  };

  const handleClear = () => {
    setTest(initialTest);
  };

  const renderElement = (element: TestType, index: number) => {
    switch (element.type) {
      case "title":
        return <TitleElement key={index} element={element} />;
      case "subtitle":
        return <SubtitleElement key={index} element={element} />;
      case "paragraph":
        return <ParagraphElement key={index} element={element} />;
      case "input":
        return (
          <InputElement
            key={index}
            element={element}
            onAnswer={(answer) => handleInputAnswer(index, answer)}
          />
        );
      case "quizz":
        return (
          <QuizzElement
            key={index}
            quizzIndex={index}
            element={element}
            onAnswer={(qIndex, answer) =>
              handleQuizzAnswer(index, qIndex, answer)
            }
            onInputAnswer={(qIndex, answer) =>
              handleInputAnswer(index, answer, qIndex)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="test-container">
      <div className="test-content">{test.elements.map(renderElement)}</div>
      <p className="test-content text-danger">
        <i className="fa-solid fa-triangle-exclamation text-danger"></i> Ce test
        ne constitue pas un diagnostic médical. Consultez un professionnel de
        santé pour une évaluation complète.
      </p>
      <ActionBar
        test={test}
        onDateChange={handleDateChange}
        onAdditionalTextChange={handleAdditionalTextChange}
        onClear={handleClear}
      />
    </div>
  );
}
