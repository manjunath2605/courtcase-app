const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("qr", qr => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("WhatsApp Ready"));

client.initialize();

module.exports = (number, message) => {
  client.sendMessage(`${number}@c.us`, message);
  console.log(`WhatsApp message sent to ${number}`);
};
