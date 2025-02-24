/**
 * imoorts JWT key from env file and converts it back into a cryptoKey and returns it
 * @author Sriram Sundar
 *
 * @async
 * @returns {Promise<CryptoKey>}
 */
const importKeyFromEnv = async (): Promise<CryptoKey> => {
  const base64Key: string | undefined = Deno.env.get("JWT_ENCRYPTION_KEY");
  if (!base64Key) {
    throw new Error("JWT_ENCRYPTION_KEY not set in environment");
  }

  const rawKey: Uint8Array = new Uint8Array(
    [...atob(base64Key)].map((char) => char.charCodeAt(0))
  );

  const cryptoKey: CryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: { name: "SHA-512" } },
    true,
    ["sign", "verify"]
  );

  return cryptoKey;
};

/**
 * optional function to generate a new cryptoKey and convert it to base64 and save it to a txt file
 * @author Sriram Sundar
 *
 * @async
 * @returns {Promise<void>}
 */
const _generateAndSaveKey = async (): Promise<void> => {
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const uint8Array = new Uint8Array(exportedKey);
  const base64Key = btoa(String.fromCharCode(...uint8Array));
  const filePath = "./jwt_secret.txt";
  await Deno.writeTextFile(filePath, base64Key);
  console.log(`Key saved to ${filePath}`);
};

export { importKeyFromEnv };
