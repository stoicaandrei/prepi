import React, { useRef, useEffect } from "react";
import { useMathQuill } from "../hooks/useMathQuill";
import { cn } from "@/lib/utils";

interface MathInputProps extends React.HTMLAttributes<HTMLSpanElement> {
  inputValue: string; // Currently this prop can only clear the input field
  onInputChange: (latex: string) => void;
  autoFocus?: boolean;
}

const MathInput: React.FC<MathInputProps> = ({
  onInputChange,
  inputValue,
  className,
  autoFocus,
  ...rest
}) => {
  const MQ = useMathQuill();
  const mathFieldRef = useRef<HTMLSpanElement>(null);
  const mathQuillRef = useRef<any>(null);

  useEffect(() => {
    if (MQ && mathFieldRef.current && !mathQuillRef.current) {
      mathQuillRef.current = MQ.MathField(mathFieldRef.current, {
        handlers: {
          edit: () => {
            const enteredMath = mathQuillRef.current.latex();
            onInputChange(enteredMath);
          },
        },
      });
      if (autoFocus) {
        mathQuillRef.current.focus();
      }
    }
  }, [MQ, onInputChange]);

  useEffect(() => {
    if (!mathQuillRef.current) return;
    console.log("inputValue", inputValue);
    if (inputValue === "") {
      mathQuillRef.current.latex(inputValue);
    }
  }, [inputValue]);

  return (
    <span
      ref={mathFieldRef}
      className={cn(
        "flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    ></span>
  );
};

export default MathInput;
