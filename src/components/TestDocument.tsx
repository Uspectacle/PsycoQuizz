import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { TFunction } from "i18next";
import type { TestData, TestType } from "../types/data";
import { computeQuizzResult } from "../helpers/exportData";

// Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 50,
    paddingHorizontal: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#003366",
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#0055aa",
  },
  paragraph: {
    marginBottom: 6,
    fontStyle: "italic",
  },
  question: {
    marginBottom: 20,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#fff4cc",
    height: 30,
    width: 30,
  },
  answerValue: {
    textAlign: "center",
    fontWeight: "bold",
  },
  answerMax: {
    fontSize: 12,
    textAlign: "center",
    marginRight: 8,
    padding: 6,
  },
  answerBoxLabel: {
    flex: 1,
    padding: 6,
    backgroundColor: "#fff4cc",
    borderRadius: 3,
  },
  result: {
    marginTop: 12,
    marginBottom: 24,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: "#d0f0d0",
    borderRadius: 5,
    fontSize: 14,
    textAlign: "center",
  },
  inputBlock: {
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 2,
  },
  inputAnswerBox: {
    marginTop: 4,
    padding: 6,
    backgroundColor: "#fff4cc",
    borderRadius: 3,
  },
  additionalInfo: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: "#fff4cc",
    borderRadius: 5,
  },
  additionalInfoTitle: {
    marginBottom: 6,
    color: "#b8860b",
  },
  disclaimer: {
    marginTop: 15,
    padding: 10,
    fontSize: 11,
    backgroundColor: "#ffe6e6",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ff9999",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default function TestDocument({
  data,
  t,
}: {
  data: TestData;
  t: TFunction;
}) {
  const renderElement = (element: TestType) => {
    switch (element.type) {
      case "title":
        return (
          <Text style={styles.title} orphans={10} wrap={false}>
            {element.content}
          </Text>
        );
      case "subtitle":
        return (
          <Text style={styles.subtitle} orphans={10} wrap={false}>
            {element.content}
          </Text>
        );
      case "paragraph":
        return (
          <Text style={styles.paragraph} wrap={false}>
            {element.content}
          </Text>
        );
      case "input":
        return (
          <View style={styles.inputBlock} wrap={false}>
            <Text style={styles.inputLabel}>{element.label}</Text>
            <Text style={styles.inputAnswerBox}>{element.answer || "--"}</Text>
          </View>
        );
      case "quizz": {
        const { score, max, percent, result } = computeQuizzResult(element, t);
        return (
          <View key={element.title} style={{ marginBottom: 14 }}>
            {element.title && (
              <Text style={styles.subtitle} orphans={10}>
                {element.title}
              </Text>
            )}
            {element.elements.map((q, i) =>
              q.type === "question" ? (
                <View key={i} style={styles.question} wrap={false}>
                  <Text>{q.text}</Text>
                  <View style={styles.answerRow}>
                    <View style={styles.circle}>
                      <Text style={styles.answerValue}>{q.answer ?? "-"}</Text>
                    </View>
                    <Text style={styles.answerMax}>
                      /{element.scale.length - 1}
                    </Text>
                    <Text style={styles.answerBoxLabel}>
                      {typeof q.answer === "number"
                        ? element.scale[q.answer]
                        : "--"}
                    </Text>
                  </View>
                </View>
              ) : (
                renderElement(q)
              )
            )}
            <View style={styles.result} wrap={false}>
              <Text widows={10}>
                {score}/{max} ({percent}%)
              </Text>
              {result && <Text>{result}</Text>}
            </View>
          </View>
        );
      }
    }
  };

  const today = new Date();
  const localizedDate = today.toLocaleDateString(data.lang, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${data.name} - ${pageNumber} / ${totalPages}`
            }
          />
          <Text>{localizedDate}</Text>
        </View>

        {/* Test Elements */}
        {data.elements.map((el, i) => (
          <View key={i}>{renderElement(el)}</View>
        ))}

        {/* Disclaimer BEFORE Additional Info */}
        <Text style={styles.disclaimer}>{t("common.disclaimer")}</Text>

        {/* Additional Information */}
        {data.additionalText && (
          <View style={styles.additionalInfo} wrap={false}>
            <Text style={styles.additionalInfoTitle}>
              {t("common.additional_info")}
            </Text>
            <Text>{data.additionalText}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
