export type PageLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <div className="py-10">
      {title && (
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {title}
            </h1>
          </div>
        </header>
      )}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
