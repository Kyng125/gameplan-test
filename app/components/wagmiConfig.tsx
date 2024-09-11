// Import necessary modules from wagmi
import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Create the Wagmi config
export const wagmiConfig = createConfig({
  connectors: [injected()], // Configure the injected connector with Polygon
  chains: [polygon], // Specify the Polygon chain
  transports: {
    [polygon.id]: http(), // Use http transport for the Polygon chain
  },
});