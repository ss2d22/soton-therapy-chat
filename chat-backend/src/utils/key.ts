export async function importKeyFromEnv(): Promise<CryptoKey> {
  const base64Key = Deno.env.get("JWT_ENCRYPTION_KEY");
  if (!base64Key) {
    throw new Error("JWT_ENCRYPTION_KEY not set in environment");
  }

  const rawKey = new Uint8Array(
    [...atob(base64Key)].map((char) => char.charCodeAt(0))
  );

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: { name: "SHA-512" } },
    true,
    ["sign", "verify"]
  );

  console.log("CryptoKey imported successfully:", cryptoKey);
  return cryptoKey;
}

// async function generateAndSaveKey() {
//   const key = await crypto.subtle.generateKey(
//     { name: "HMAC", hash: "SHA-512" },
//     true,
//     ["sign", "verify"]
//   );

//   const exportedKey = await crypto.subtle.exportKey("raw", key);

//   const uint8Array = new Uint8Array(exportedKey);
//   const base64Key = btoa(String.fromCharCode(...uint8Array));

//   const filePath = "./jwt_secret.txt";
//   await Deno.writeTextFile(filePath, base64Key);

//   console.log(`Key saved to ${filePath}`);
// }
