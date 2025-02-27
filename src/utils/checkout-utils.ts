import crypto from "crypto";

/**
 * Serialize and encode the payment data for Paysera
 */
export function serializeAndEncode(data: Record<string, string | number>): string {
  // Ensure all values are strings
  const stringifiedData: Record<string, string> = Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = String(value);
    return acc;
  }, {} as Record<string, string>);

  // Serialize into URL query string format
  const queryString = new URLSearchParams(stringifiedData).toString();

  // Encode into Base64 (standard format, no replacements)
  return Buffer.from(queryString).toString("base64");
}
  

/**
 * Generate the signature using Node.js crypto
 */
export function generateSignature(encodedData: string): string {
  // Concatenate data and password
  const projectPassword = process.env.NEXT_PUBLIC_PAYSERA_PROJECT_PASSWORD!
  const signString = encodedData + projectPassword;
  return crypto.createHash("md5").update(signString).digest("hex");
}

/**
 * Redirect the user to Paysera payment gateway
 */
/**
 * Redirect the user to Paysera payment gateway via a POST request
 */
/**
 * Redirect the user to Paysera payment gateway
 */
export function redirectToPaysera(paymentData: Record<string, string | number>): void {
  const encodedData = serializeAndEncode(paymentData);
  const signature = generateSignature(encodedData);


  // Create a form element dynamically
  const form = document.createElement("form");
  form.action = "https://www.paysera.com/pay/";
  form.method = "POST";

  // Add the encoded data and signature as hidden input fields
  const dataInput = document.createElement("input");
  dataInput.type = "hidden";
  dataInput.name = "data";
  dataInput.value = encodedData;
  form.appendChild(dataInput);

  const signInput = document.createElement("input");
  signInput.type = "hidden";
  signInput.name = "sign";
  signInput.value = signature;
  form.appendChild(signInput);

  // Append the form to the body and submit it
  document.body.appendChild(form);
  form.submit();
}
