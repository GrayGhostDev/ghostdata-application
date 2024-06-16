import { useMemo } from "react";
import { createThirdwebClient } from "thirdweb";

const useThirdwebClient = () => {
  const clientId = process.env.REACT_APP_THIRDWEB_CLIENT_ID;

  if (!clientId) {
    throw new Error("THIRDWEB_CLIENT_ID is not defined in the environment variables");
  }

  const client = useMemo(
    () =>
      createThirdwebClient({
        clientId,
      }),
    [clientId]
  );

  return client;
};

export default useThirdwebClient;
