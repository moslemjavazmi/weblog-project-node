const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    host: "mail.daianweb.com",
    port: 465,
    secure: true,
    auth: {
        user: "admin@daianweb.com",
        pass: "Jvzmy3532572735"
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendEmail = (email , fullname, subject, message) => {
    const transport = nodeMailer.createTransport(transporterDetails);
    transport.sendMail({
        from: "admin@daianweb.com",
        to: email,
        subject: subject,
        html: `<h1>سلام ${fullname}</h1><p>${message}</p></message>`,
        
    })
}
