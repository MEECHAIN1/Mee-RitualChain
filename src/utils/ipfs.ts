const PINATA_GATEWAY = (import.meta as any).env?.VITE_PINATA_GATEWAY || "tan-familiar-impala-721.mypinata.cloudd";

const getHeaders = () => {
  const jwt = (import.meta as any).env?.VITE_PINATA_JWT;
  const apiKey = (import.meta as any).env?.VITE_PINATA_API_KEY;
  const apiSecret = (import.meta as any).env?.VITE_PINATA_API_SECRET;

  if (jwt) {
    return { Authorization: `Bearer ${jwt}` };
  }

  if (apiKey && apiSecret) {
    return {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    };
  }
  return {};
};

export const getGatewayUrl = (ipfsHash: string) => {
    return `https://${PINATA_GATEWAY}/ipfs/${ipfsHash.replace("ipfs://", "")}`;
}

export const getMeeBotImageUrl = (ipfsHash: string | undefined | null) => {
    if (!ipfsHash) return "";
    if (ipfsHash.startsWith("ipfs://")) {
        return getGatewayUrl(ipfsHash);
    }
    return ipfsHash;
}

export async function uploadToIPFS(file: File): Promise<string> {
  const headers = getHeaders();
  
  // Check if we have valid credentials (either JWT or Key pair)
  const hasCredentials = headers.Authorization || (headers.pinata_api_key && headers.pinata_secret_api_key);

  if (!hasCredentials) {
    console.warn("⚠️ No Pinata keys found. Simulating IPFS upload.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "ipfs://QmMockImageHash123456789";
  }

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    headers: headers as HeadersInit, 
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.details || "Failed to upload image");
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

export async function uploadJSONToIPFS(json: object): Promise<string> {
  const headers = getHeaders();
  const hasCredentials = headers.Authorization || (headers.pinata_api_key && headers.pinata_secret_api_key);

  if (!hasCredentials) {
    console.warn("⚠️ No Pinata keys found. Simulating IPFS JSON upload.");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "ipfs://QmMockMetadataHash123456789";
  }

  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers as HeadersInit),
    },
    body: JSON.stringify(json),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.details || "Failed to upload JSON");
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}