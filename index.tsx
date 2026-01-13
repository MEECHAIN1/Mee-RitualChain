import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import './index.css';
import '@rainbow-me/rainbowkit';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './src/wagmi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
     <WagmiProvider config={config}>
       <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#ff8906",
            accentColorForeground: "#ffffff",
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
   </WagmiProvider>
  );
}
