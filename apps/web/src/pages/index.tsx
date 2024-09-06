export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false, // If true, the redirect is cached permanently
    },
  };
}

export default function HomePage() {
  return <p>Redirecting...</p>;
}
