// src/thirdweb/serverClient.js
import { createThirdwebClient } from "@thirdweb-dev/sdk";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export default client;
