import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { registerUserAutomatic } from "~~/services/api/users";

export function useAutoRegister() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { mutate: autoRegister, isPending: isAutoRegistering } = useMutation({
    mutationFn: registerUserAutomatic,
    onSuccess: user => {
      queryClient.setQueryData(["user", address], user);
    },
    onError: (error: Error) => {
      console.error("Auto registration error:", error);
      // Don't show error notification for auto registration
    },
  });

  useEffect(() => {
    if (address) {
      autoRegister({ address });
    }
  }, [address, autoRegister]);

  return {
    isAutoRegistering,
  };
}
