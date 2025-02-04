import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    //@ts-ignore
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
        user: process.env.GMAIL_FROM!,
        pass: process.env.GMAIL_APP_PASS!,
    }
})

export default transporter;