'use server'

import { z } from 'zod'
import transporter from '@/utils/mailersend'

const contactSchema = z.object({
    name: z.string().min(1, 'Vardas yra privalomas'),
    email: z.string().email('Neteisingas el. pašto formatas'),
    phone: z.string().min(1, 'Telefono numeris yra privalomas'),
    message: z.string().min(1, 'Aprašymas yra privalomas'),
})


export async function submitContactForm(prevState: any, formData: FormData) {
    try {

        const rawData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            message: formData.get('message') as string,
        }

        console.log('Submitting application from ', rawData.email)

        const validatedData = contactSchema.safeParse(rawData)

        if (!validatedData.success) {
            return {
                success: false,
                message: 'Prašome pataisyti klaidas formoje',
                errors: validatedData.error.flatten().fieldErrors,
            }
        }
        
        const info = await transporter.sendMail({
            from: process.env.GMAIL_FROM!,
            to: validatedData.data.email,
            subject: 'test',
            text: 'Hi'
        })

        console.log(info)


        return {
            success: true,
            message: 'Užklausa išsiųsta sėkmingai!',
        }
    } catch (error) {
        console.error('Error while sending email: ', error)
        return {
            success: false,
            message: 'Įvyko netikėta klaida',
        }
    }
}