import { ReactNode } from "react";

export default function MdxLayout({ children }: { children: ReactNode }) {
  // Create any shared layout or styles here
  return <div className="container mx-auto px-4 py-4">{children}</div>;
}
