import { config } from '../wagmi';
import { createPublicClient, http, Address, parseEther } from 'viem';
import { getPublicClient } from '@wagmi/core';

export async function canAffordGas({
  from,
  to,
  data,
  value = 0n,
}: {
  from: Address;
  to: Address;
  data?: `0x${string}`;
  value?: bigint;
}) {
  const publicClient = getPublicClient(config);
  if (!publicClient) throw new Error("Public client not found");

  const [balance, gas, gasPrice] = await Promise.all([
    publicClient.getBalance({ address: from }),
    publicClient.estimateGas({ account: from, to, data, value }).catch(() => 21000n),
    publicClient.getGasPrice(),
  ]);

  // Fix: Explicitly cast operands to BigInt to resolve "number and bigint" addition errors.
  // This ensures types are synchronized regardless of inference from RPC clients or tuple destructing.
  const required = BigInt(gas) * BigInt(gasPrice) + BigInt(value);
  return { 
    ok: balance >= required, 
    required, 
    balance, 
    gas, 
    gasPrice,
    diff: required - balance
  };
}