import { ContactForm } from "./form";

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Contact</h1>
      <p className="text-gray-600 text-center mb-8">
        Ne bucurăm că folosești Prepi! Dacă ai întrebări poți folosi formularul
        de mai jos pentru a ne trimite un e-mail. Pentru probleme tehnice, îți
        recomandăm să folosești chat-ul din dreapta jos.
      </p>
      <ContactForm />
    </main>
  );
}
