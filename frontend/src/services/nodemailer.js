import nodemailer from 'nodemailer';

/**
 * 
 * @param {*} to 'eamil1@emai.com email2@email.com'
 * @param {*} subject ''
 * @param {*} html '<p>내용</p>'
 */
const nodeMailer = async (to='',subject='',html='')=>{

    async function send(to='',subject='',html=''){

        //let nodemailer = require("nodemailer");
        const user = 'admin@epyeonhan.com';
        const password = '4b940N5iQGZT';
        const from = '"e편한 견적" <admin@epyeonhan.com>';

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.worksmobile.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: user, // generated ethereal user
                pass: password, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: "Hello world?", // plain text body
            html: html, // html body
        });
        
    }

    await send(to,subject,html).catch(console.error);

}

export{
    nodeMailer
}