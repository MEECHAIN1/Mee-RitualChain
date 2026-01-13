import React from "react";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({
    address,
    watch: true, // อัปเดต realtime
  });

  return (
    <div className="min-h-screen bg-meebot-bg text-meebot-text-primary flex flex-col items-center justify-center p-6">
      {/* ปุ่ม Connect Wallet */}
      <ConnectButton />

      {isConnected ? (
        <div className="mt-8 w-full max-w-md bg-meebot-surface border border-meebot-border rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-meebot-accent mb-4">
            Wallet Dashboard
          </h2>

          {/* Address */}
          <div className="mb-3">
            <span className="text-meebot-text-secondary">Address:</span>
            <p className="break-all font-mono">{address}</p>
          </div>

          {/* Chain */}
          <div className="mb-3">
            <span className="text-meebot-text-secondary">Network:</span>
            <p>{chain?.name ?? "Unknown"}</p>
          </div>

          {/* Balance */}
          <div className="mb-3">
            <span className="text-meebot-text-secondary">Balance:</span>
            <p>
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-meebot-text-secondary">
          กรุณาเชื่อมต่อ Wallet เพื่อดูข้อมูล
        </p>
      )}
    </div>
  );
}