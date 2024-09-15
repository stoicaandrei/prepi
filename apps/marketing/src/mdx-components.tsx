import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, ...props }) => (
      <Link href={href ?? "#"} target="_blank" {...props} />
    ),
  };
}
