// Chat GPT
function generateRandomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
}

function GenAuthorization() {
  let auth = generateRandomString(128)
  return auth;
}

function GenAuthSecret() {
  let secret = generateRandomString(64)
  return secret;
}

module.exports = { GenAuthSecret, GenAuthorization, GenRandom: generateRandomString }