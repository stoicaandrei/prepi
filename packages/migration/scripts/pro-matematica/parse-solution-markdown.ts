const listPoints = (text: string) => {
  const pointsRegex = /(\d)\s*p|(?:\\mathbf\{p\})/g;
  const points = [];

  let match;
  while ((match = pointsRegex.exec(text)) !== null) {
    const [, point] = match;
    const nr = point ? parseInt(point) : 1;
    points.push(nr);
  }

  return points;
};

export const parseSolutionMarkdownToJson = (markdown: string) => {
  const sub1Text = extractContent(markdown, "SUBIECTUL I", "II-lea");

  const sub2Text = extractContent(markdown, "II-lea", "III-lea");

  const sub3Text = extractContent(markdown, "III-lea");

  const sub1_1 = extractContent(sub1Text, "| $1$. |", "| $2$. |");

  const sub1_2 = extractContent(sub1Text, "| $2$. |", "| $3$. |");

  const sub1_3 = extractContent(sub1Text, "| $3$. |", "| $4$. |");

  const sub1_4 = extractContent(sub1Text, "| $4$. |", "| $5$. |");

  const sub1_5 = extractContent(sub1Text, "| $5$. |", "| $6$. |");

  const sub1_6 = extractContent(sub1Text, "| $6$. |");

  const sub2_1_text = extractContent(sub2Text, "| 1.a) |", "| 2.a) |");

  const sub2_1_a = extractContent(sub2_1_text, "| 1.a) |", "| b) |");

  const sub2_1_b = extractContent(sub2_1_text, "| b) |", "| c) |");

  const sub2_1_c = extractContent(sub2_1_text, "| c) |");

  const sub2_2_text = extractContent(sub2Text, "| 2.a) |");

  const sub2_2_a = extractContent(sub2_2_text, "| 2.a) |", "| b) |");

  const sub2_2_b = extractContent(sub2_2_text, "| b) |", "| c) |");

  const sub2_2_c = extractContent(sub2_2_text, "| c) |");

  const sub3_1_text = extractContent(sub3Text, "| 1.a) |", "| 2.a) |");

  const sub3_1_a = extractContent(sub3_1_text, "| 1.a) |", "| b) |");

  const sub3_1_b = extractContent(sub3_1_text, "| b) |", "| c) |");

  const sub3_1_c = extractContent(sub3_1_text, "| c) |");

  const sub3_2_text = extractContent(sub3Text, "| 2.a) |");

  const sub3_2_a = extractContent(sub3_2_text, "| 2.a) |", "| b) |");

  const sub3_2_b = extractContent(sub3_2_text, "| b) |", "| c) |");

  const sub3_2_c = extractContent(sub3_2_text, "| c) |");

  const result = {
    "1.1": {
      points: listPoints(sub1_1),
      content: sub1_1,
    },
    "1.2": {
      points: listPoints(sub1_2),
      content: sub1_2,
    },
    "1.3": {
      points: listPoints(sub1_3),
      content: sub1_3,
    },
    "1.4": {
      points: listPoints(sub1_4),
      content: sub1_4,
    },
    "1.5": {
      points: listPoints(sub1_5),
      content: sub1_5,
    },
    "1.6": {
      points: listPoints(sub1_6),
      content: sub1_6,
    },

    "2.1.a": {
      points: listPoints(sub2_1_a),
      content: sub2_1_a,
    },
    "2.1.b": {
      points: listPoints(sub2_1_b),
      content: sub2_1_b,
    },
    "2.1.c": {
      points: listPoints(sub2_1_c),
      content: sub2_1_c,
    },

    "2.2.a": {
      points: listPoints(sub2_2_a),
      content: sub2_2_a,
    },
    "2.2.b": {
      points: listPoints(sub2_2_b),
      content: sub2_2_b,
    },
    "2.2.c": {
      points: listPoints(sub2_2_c),
      content: sub2_2_c,
    },

    "3.1.a": {
      points: listPoints(sub3_1_a),
      content: sub3_1_a,
    },
    "3.1.b": {
      points: listPoints(sub3_1_b),
      content: sub3_1_b,
    },
    "3.1.c": {
      points: listPoints(sub3_1_c),
      content: sub3_1_c,
    },

    "3.2.a": {
      points: listPoints(sub3_2_a),
      content: sub3_2_a,
    },
    "3.2.b": {
      points: listPoints(sub3_2_b),
      content: sub3_2_b,
    },
    "3.2.c": {
      points: listPoints(sub3_2_c),
      content: sub3_2_c,
    },
  };

  return result;
};

function extractContent(text: string, startString: string, endString?: string) {
  const startIndex = text.indexOf(startString);
  if (startIndex === -1) {
    throw new Error(`Start string not found: ${startString}`);
  }

  if (!endString) {
    return text.slice(startIndex);
  }

  const contentStart = startIndex + startString.length;
  const endIndex = text.indexOf(endString, contentStart);
  if (endIndex === -1) {
    throw new Error(`End string not found: ${endString}`);
  }

  return text.slice(startIndex, endIndex);
}
