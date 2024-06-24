import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, id: number, dateStr: string, attachmentPath: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Taxi Trajectory for ID ${id} on ${dateStr}`,
    text: `Attached is the taxi trajectory data for taxi ID ${id} on ${dateStr}.`,
    attachments: [
      {
        path: attachmentPath,
      },
    ],
  };
  await transporter.sendMail(mailOptions);
};