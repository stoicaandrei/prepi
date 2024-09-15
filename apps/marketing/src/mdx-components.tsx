import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, ...props }) => (
      <Link href={href ?? "#"} target="_blank" {...props} />
    ),
    h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
    p: (props) => <p className="mb-4" {...props} />,
  };
}
