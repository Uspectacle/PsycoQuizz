import type { TestData, TestType } from "../types/data";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionBar from "./ActionBar";
import "../styles/elements.css";
import TitleElement from "./elements/TitleElement";
import InputElement from "./elements/InputElement";
import ParagraphElement from "./elements/ParagraphElement";
import QuizzElement from "./elements/QuizzElement";
import SubtitleElement from "./elements/SubtitleElement";
import { loadTestData, saveTestData } from "../helpers/translationHelper";

type Props = {
  test: TestData;
};

export default function TestContainer({ test: initialTest }: Props) {
  const [test, setTest] = useState<TestData>(() => {
    const savedTest = loadTestData(initialTest.id, initialTest.lang);
    return savedTest || initialTest;
  });

  useEffect(() => {
    const savedTest = loadTestData(initialTest.id, initialTest.lang);
    setTest(savedTest || initialTest);
  }, [initialTest]);

  useEffect(() => {
    saveTestData(test, test.lang);
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

  const { t } = useTranslation();

  return (
    <div className="test-container">
      <a
        href={"documents/" + test.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>
          <i className="fa-solid fa-file-pdf"></i> {t("actions.originalDoc")}
        </button>
      </a>
      <div className="test-content">{test.elements.map(renderElement)}</div>
      <p className="disclaimer text-danger">
        <i className="fa-solid fa-triangle-exclamation text-danger"></i>{" "}
        {t("common.disclaimer")}
      </p>
      <ActionBar
        test={test}
        onAdditionalTextChange={handleAdditionalTextChange}
        onClear={handleClear}
      />
    </div>
  );
}
