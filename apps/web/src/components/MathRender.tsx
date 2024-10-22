"use client";

import { MathJax, MathJaxProps } from "better-react-mathjax";
import { ComponentPropsWithoutRef } from "react";
import reactStringReplace from "react-string-replace";

type MathRenderProps = MathJaxProps &
  ComponentPropsWithoutRef<"span"> & {
    content: string;
  };

const cleanupLatex = (text: string) =>
  text?.replace(/\$([^$]+)\$/g, "\\($1\\)");
// ?.replace(/\$([^$]+)\$/g, "\\($1\\)")
// .replace(/([^& ])\s*=\s*/g, "$1 &= ")
// .replace(/([^& ])\s*\\Rightarrow\s*/g, "$1 &\\Rightarrow ");

// ![Image](https://cdn.mathpix.com/cropped/2024_10_22_2ca51d87e6c7d61e400ag-2.jpg?height=468&width=578&top_left_y=1867&top_left_x=355)
const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;

export const MathRender = ({ content, ...props }: MathRenderProps) => {
  const text = cleanupLatex(content);

  const finalContent = reactStringReplace(
    text,
    markdownImageRegex,
    (match, i) => {
      return <img key={i} src={match} alt="math" />;
    },
  );

  return <MathJax {...props}>{finalContent}</MathJax>;
};
