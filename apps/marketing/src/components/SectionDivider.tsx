import Image from "next/image";

type SectionDividerProps = {
  shape: string;
  className?: string;
};

export function SectionDivider({ shape, className }: SectionDividerProps) {
  return (
    <Image
      src={`/_homepage/shapes/${shape}.svg`}
      alt=""
      width={1000}
      height={100}
      className={className + " p-shape"}
      style={{ width: "100%", height: "auto" }}
      draggable={false}
      aria-hidden="true"
      priority
    />
  );
}
