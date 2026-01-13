import React from 'react';
import { useChainId, useSwitchChain } from 'wagmi';


export const NetworkSwitcher = () => {
  const chainId = useChainId();
  const { chains, switchChain, isPending, error } = useSwitchChain();

  return (
    <div className="p-4 border rounded-lg bg-gray-900 text-white border-gray-700 w-full max-w-md">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        🌐 เลือกเครือข่าย (Network)
      </h3>

      <div className="grid gap-2">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            disabled={isPending || chain.id === chainId}
            className={`
              flex items-center justify-between px-4 py-3 rounded-lg transition-all border
              ${chain.id === chainId 
                ? 'bg-blue-900/30 border-blue-500 text-blue-400 cursor-default' 
                : 'bg-gray-800 hover:bg-gray-700 border-transparent text-gray-300 hover:text-white hover:border-gray-600'}
              ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${chain.id === chainId ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-gray-600'}`} />
              <span className="font-medium">{chain.name}</span>
            </div>

            {chain.id === chainId && (
              <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                Connected
              </span>
            )}

            {isPending && (
               <span className="animate-spin text-gray-400">⌛</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 text-sm text-red-400 bg-red-900/20 rounded border border-red-900/50 flex items-start gap-2">
          <span>⚠️</span>
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};