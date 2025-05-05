/**
 * Format an Ethereum address to a shortened format (e.g., 0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
