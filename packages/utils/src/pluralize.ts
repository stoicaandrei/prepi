type PluralWord = "zile" | "puncte";

export const pluralize = (word: PluralWord, count: number) => {
  const single = count === 1;

  switch (word) {
    case "zile":
      return single ? "zi" : "zile";
    case "puncte":
      return single ? "punct" : "puncte";
  }
};
