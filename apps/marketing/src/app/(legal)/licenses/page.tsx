import Link from "next/link";

export const metadata = {
  title: "Licențe | Prepi",
  description: "Informații despre licențele și atribuirile utilizate în Prepi.",
};

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Licențe</h1>

      <p className="mb-4">
        Icons made by{" "}
        <Link
          href="https://www.flaticon.com/authors/popcorns-arts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Icon Pond
        </Link>{" "}
        from{" "}
        <Link
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.flaticon.com
        </Link>{" "}
        are under{" "}
        <Link
          href="http://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          CC 3.0 BY
        </Link>
      </p>

      <p className="mb-4">
        Icons made by{" "}
        <Link
          href="http://www.freepik.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Freepik
        </Link>{" "}
        from{" "}
        <Link
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.flaticon.com
        </Link>{" "}
        are under{" "}
        <Link
          href="http://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          CC 3.0 BY
        </Link>
      </p>

      <p className="mb-4">
        Icons made by{" "}
        <Link
          href="https://www.flaticon.com/authors/dave-gandy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Dave Gandy
        </Link>{" "}
        from{" "}
        <Link
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.flaticon.com
        </Link>{" "}
        are under{" "}
        <Link
          href="http://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          CC 3.0 BY
        </Link>
      </p>

      <p className="mb-4">
        Quiz sound effects by{" "}
        <Link
          href="https://freesound.org/people/Bertrof/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Bertrof
        </Link>{" "}
        and{" "}
        <Link
          href="https://freesound.org/people/rhodesmas/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          rhodesmas
        </Link>
      </p>

      <p className="mb-4">
        Mockups on the home page made by{" "}
        <Link
          href="https://www.anthonyboyd.graphics/license"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          anthonyboyd
        </Link>
      </p>
    </div>
  );
}
