import mailer from 'nodemailer'

export default new class MailService{


    async sendMail(to:string){
        
        const testEmailAccount = await mailer.createTestAccount()

        const transporter = mailer.createTransport({
            service:'gmail',
            auth:{
                user:"boyd.emai.test@gmail.com",
                pass:"Roket980129"
            }
        })
        
        const result = await transporter.sendMail({
            from: '"Node js" <nodejs@example.com>',
            to: to,
            subject: 'Message from Node js',
            text: 'This message was sent from Node js server.',
            html:'This <i>message</i> was sent from <strong>Node js<strong> server.',
        })

        console.log(result)

        return result
    }
}