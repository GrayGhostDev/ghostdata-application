const shortenAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export default shortenAddress;
