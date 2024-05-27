// server/thirdwebClientServer.ts
import { ThirdwebSDK } from "thirdweb";

const client = new ThirdwebSDK(
  import.meta.env.THIRDWEB_CLIENT_ID || "<import.meta.THIRDWEB_SECRET_KEY>",
  
);

export default client;
