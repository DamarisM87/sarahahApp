import { EventEmitter } from "events";
import { generateToken } from "../token/generateToken.js";
import { sendEmail } from "../../service/sendEmail.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
  const { email } = data;

  const token = await generateToken({
    payload: { email },
    SIGNATURE: process.env.SIGNATURE,
    options: { expiresIn: 60 * 3 }, // 3 minutes
  });

  const link = `http://localhost:3000/users/confirmEmail/${token}`;

  const isSend = await sendEmail({
    to: email,
    subject: "Confirm your email",
    html: `<a href="${link}">Confirm Email</a>`,
  });

  if (!isSend) {
    // only throw if sending failed
    throw new Error("Failed to send email", { cause: 400 });
  }
});
