import { useUser } from "@clerk/nextjs";

enum Role {
  Admin = "admin",
  Tester = "tester",
}

type PublicMetadata = {
  roles?: Role[];
};

export const useUserRoles = () => {
  const { user } = useUser();

  const meta = user?.publicMetadata as PublicMetadata;

  const isAdmin = meta?.roles?.includes(Role.Admin);
  const isTester = meta?.roles?.includes(Role.Tester);

  return {
    isAdmin,
    isTester,
  };
};
