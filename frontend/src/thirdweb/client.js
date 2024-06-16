// src/thirdweb/frontend.js
import { createThirdwebClient } from "@thirdweb-dev/sdk";

const client = createThirdwebClient({
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
});

export default client;
