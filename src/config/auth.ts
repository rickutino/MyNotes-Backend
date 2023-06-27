export default {
  jwt: {
    secretToken: process.env.AUTH_SECERT || "dafault",
    expiresIn: "1d",
  }
}