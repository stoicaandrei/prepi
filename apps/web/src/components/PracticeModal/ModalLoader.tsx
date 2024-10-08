import Image from "next/image";

type ModalLoaderProps = {
  message?: string;
};

export const ModalLoader = ({
  message = "Se încarcă...",
}: ModalLoaderProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center text-lg font-semibold">{message}</div>
        <Image
          src="/effects/load.gif"
          alt="loading bars"
          width={220}
          height={10}
        />
      </div>
    </div>
  );
};
