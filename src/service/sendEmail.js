import nodemailer from "nodemailer";

export const sendEmail = async({ to })=>{
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "cosmicangel08@gmail.com",
        pass: "ijtqpbazluynyiom",
      },
    });
    
    
      const info = await transporter.sendMail({
        from: '"Hola amigo" <cosmicangel08@gmail.com>',
        to: to ||"damarisflamingsword@gmail.com",
        subject: subject || "Hello ✔",
        
        html: html ||"<b>Hello world?</b>", // HTML body
        attachments: attachments || []
      });
    
if(info.accepted.length>0){
return true
}
else {
  return false
}   
}