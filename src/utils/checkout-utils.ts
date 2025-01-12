import crypto from "crypto";

/**
 * Serialize and encode the payment data for Paysera
 */
export function serializeAndEncode(data: Record<string, string | number>): string {
    // Convert all values to strings
    const stringifiedData: Record<string, string> = Object.keys(data).reduce((acc, key) => {
      acc[key] = String(data[key]);
      return acc;
    }, {} as Record<string, string>);
  
    const queryString = new URLSearchParams(stringifiedData).toString();
    const base64String = Buffer.from(queryString).toString("base64");
    return base64String.replace(/\+/g, "-").replace(/\//g, "_");
  }
  

/**
 * Generate the signature using Node.js crypto
 */
export function generateSignature(encodedData: string, projectPassword: string): string {
  const signString = encodedData + projectPassword;
  return crypto.createHash("md5").update(signString).digest("hex");
}

/**
 * Redirect the user to Paysera payment gateway
 */
export function redirectToPaysera(paymentData: Record<string, string | number>, projectPassword: string): void {
    const encodedData = serializeAndEncode(paymentData);
    const signature = generateSignature(encodedData, projectPassword);
    const payseraUrl = `https://www.paysera.com/pay/?data=${encodedData}&sign=${signature}`;
    window.location.href = payseraUrl; // Redirect user to Paysera gateway
  }
  
