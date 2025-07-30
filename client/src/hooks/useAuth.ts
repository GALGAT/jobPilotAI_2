
import { useQuery } from "@tanstack/react-query";
import { useUser, useClerk } from "@clerk/nextjs";

export function useAuth() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!clerkUser && isLoaded,
  });

  const login = () => {
    // Clerk handles login through its components
    window.location.href = "/sign-in";
  };

  const logout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return {
    user: clerkUser ? {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      profileImageUrl: clerkUser.imageUrl || ''
    } : user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!clerkUser,
    login,
    logout,
  };
}
