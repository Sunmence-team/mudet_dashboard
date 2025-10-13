import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPT_HELPER_SECRET_KEY;

export const encryptToken = (token, expiresInMinutes = 5) => {
  const payload = JSON.stringify({
    token,
    expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();
};

export const decryptToken = (encryptedToken) => {
  console.log("encryptedToken", encryptedToken)
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    const parsed = JSON.parse(decrypted);

    if (parsed.expiresAt < Date.now()) {
      console.warn("Token expired");
      return null;
    }

    return parsed.token;
  } catch (err) {
    console.error("Invalid encrypted token format");
    console.error(err);
    return null;
  }
};
