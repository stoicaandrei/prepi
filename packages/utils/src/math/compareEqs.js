import { ProblemParser } from "./problemParser";

// Don't modify this function
// Don't try to understand this function

const evalInfix = (eq) => new ProblemParser(eq).eval(244);
const compare = (val1, val2) =>
  Math.abs(evalInfix(val1) - evalInfix(val2)) < 0.0001;

const latexToInfix = (latex) => {
  let infix = latex;

  // console.log(infix);
  if (infix.includes("log")) {
    infix = infix
      .replace(/log_2/g, "log_two")
      .replace(/log_3/g, "log_three")
      .replace(/log_4/g, "log_four")
      .replace(/log_5/g, "log_five")
      .replace(/log_6/g, "log_six")
      .replace(/log_7/g, "log_seven")
      .replace(/log_8/g, "log_eight")
      .replace(/log_9/g, "log_nine");
  }

  infix = infix
    .replace(/\s+/, "")
    .replace(/\\overline\{(.*)\}/g, "$1")
    .replace(/\\mathbb\{\w\}/g, "(-infty.infty)")
    .replace(/\\vec\{(.*)\}/g, "$1")
    .replace(/\\hat\{(.*)\}/g, "$1")
    .replace(
      /\\(log_two|log_three|log_four|log_five|log_six|log_seven|log_eight|log_nine|log|ln|lg|sin|cos|tan|sec|csc|ctg|tg|sqrt|arcsin|arccos|arctan)(?:\^(\d{1}|\w{1}|\{.*\})){1}(\d*[^\W_]*)/g,
      "$1($3)^$2"
    )
    .replace(
      /\\(log_two|log_three|log_four|log_five|log_six|log_seven|log_eight|log_nine|log|ln|lg|sin|cos|tan|sec|csc|ctg|tg|sqrt|arcsin|arccos|arctan)(\d*[^\W_]*)/g,
      "$1($2)"
    )
    .replace(/\\frac{([^}]+)}{([^}]+)}/g, "($1)/($2)") // fractions
    .replace(/\\left\(/g, "(")
    .replace(/\\right\)/g, ")")
    .replace(/\\left\[/g, "[")
    .replace(/\\right\]/g, "]")
    .replace(/\\left\\\{/g, "{")
    .replace(/\\right\\\}/g, "}")
    .replace(/\)([\w])/g, ")*$1")
    .replace(/([0-9x)])([(A-Za-z])/g, "$1*$2")
    .replace(/\\cdot/g, "*")
    .replace(/\(-/g, "(0-")
    .replace(/\(\)\*/g, "")
    .replace(/\\+/g, "\\");

  return infix;
};

const parseNumberSet = (infix) => {
  const setToArray = (set) => {
    let result = [[{}, {}]];
    let setL = set.length - 1;

    if (set[0] == "{")
      return set
        .slice(1, setL)
        .split(".")
        .map((el) => evalInfix(el))
        .sort()
        .map((el) => [
          { open: false, val: el },
          { open: false, val: el },
        ]);

    if (set[0] == "(") result[0][0].open = true;
    else if (set[0] == "[") result[0][0].open = false;

    if (set[setL] == ")") result[0][1].open = true;
    else if (set[setL] == "]") result[0][1].open = false;

    set = set.slice(1, setL).split(".");

    result[0][0].val = evalInfix(set[0]);
    result[0][1].val = evalInfix(set[1]);

    return result;
  };

  const union = (set1, set2) => {
    if (set2[0][0].val == set2[0][1].val) {
      let result = set1;

      for (let i = 0; i < set2.length; i++)
        if (
          set2[i][0].val > result[0][1].val ||
          set2[i][0].val < result[0][0].val
        )
          result.push(set2[i]);
      return result;
    }

    if (set2[0][0].val < set1[0][0].val) [set1, set2] = [set2, set1];

    if (set2[0][0].val < set1[0][1].val) return [[set1[0][0], set2[0][1]]];

    if (
      set2[0][0].val == set1[0][1].val &&
      !(set2[0][0].open && set1[0][1].open)
    )
      return [[set1[0][0], set2[0][1]]];

    return [set1[0], set2[0]];
  };

  const difference = (set1, set2) => {
    let result = set1;

    for (let i = 0; i < set2.length; i++) {
      const val = set2[i][0].val;

      let res2 = [];
      for (let j = 0; j < result.length; j++) {
        if (result[j][1].val > val && result[j][0].val < val) {
          res2.push(
            [result[j][0], { open: true, val }],
            [{ open: true, val }, result[j][1]]
          );
        } else {
          res2.push(result[j]);
        }
      }
      result = res2;
    }
    return result;
  };

  if (infix.includes("\\cup")) {
    infix = infix.split("\\cup");

    return union(setToArray(infix[0]), setToArray(infix[1]));
  } else if (infix.includes("\\backslash")) {
    infix = infix.split("\\backslash");

    return difference(setToArray(infix[0]), setToArray(infix[1]));
  } else {
    return setToArray(infix);
  }
};

export const compareEqs = (eq1, eq2) => {
  const parseLatex = (a) =>
    a
      .replace(/,|;/g, ".")
      .replace(/\\begin{pmatrix}|\\end{pmatrix}/g, "")
      .replace(/\\pi/g, "pi");

  const splitEq = (a) => a.split(/&|\\\\/g);

  const normalize = (infix) =>
    infix.replace(/\[|\{/g, "(").replace(/\]|\}/g, ")");

  const isNumberSet = (a) =>
    (["(", "[", "{"].includes(a[0]) &&
      [")", "]", "}"].includes(a[a.length - 1]) &&
      a.includes(".")) ||
    a.includes("cup") ||
    a.includes("cap") ||
    a.includes("backslash");

  try {
    eq1 = parseLatex(eq1);
    eq2 = parseLatex(eq2);

    eq1 = latexToInfix(eq1);
    eq2 = latexToInfix(eq2);

    // console.log('eq1', eq1);
    // console.log('eq2', eq2);

    if (isNumberSet(eq1) && isNumberSet(eq2)) {
      eq1 = parseNumberSet(eq1);
      eq2 = parseNumberSet(eq2);

      // console.log(eq1);
      // console.log(eq2);

      return JSON.stringify(eq1) === JSON.stringify(eq2);
    } else {
      eq1 = normalize(eq1);
      eq2 = normalize(eq2);
      eq1 = splitEq(eq1);
      eq2 = splitEq(eq2);

      // console.log(eq1);
      // console.log(eq2);

      if (eq1.length != eq2.length) {
        return false;
      } else {
        for (let i = 0; i < eq1.length; i++) {
          if (!eq1[i] || !eq2[i] || !compare(eq1[i], eq2[i])) {
            return false;
          }
        }
      }
    }
  } catch (e) {
    // console.log(e);
    return false;
  }

  return true;
};
