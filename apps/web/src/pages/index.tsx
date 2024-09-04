import type { NextPage } from "next";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const { push } = useRouter();
  push("/exams");

  return null;
};

export default Home;
