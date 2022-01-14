import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    MAILING_SERVICE_REDIRECT_URL,
    SENDER_EMAIL_ADDRESS
} = process.env;

const oauth2Client = new google.auth.OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REDIRECT_URL
);

// send mail
const sendEmail = async (to, subject, url, text, action) => {
    try {
        oauth2Client.setCredentials({
            refresh_token: MAILING_SERVICE_REFRESH_TOKEN
        });

        const accessToken = await oauth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: SENDER_EMAIL_ADDRESS,
                clientId: MAILING_SERVICE_CLIENT_ID,
                clientSecret: MAILING_SERVICE_CLIENT_SECRET,
                refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        
        await transporter.sendMail({
            from: SENDER_EMAIL_ADDRESS, 
            to: to,
            subject: subject,
            html: 
            `
                <div style="max-width: 600px; margin:auto; border: 5px solid #ddd; padding: 20px 20px; background-color: white;">
                    <h2>Hello!</h2>
                    <p>
                        ${text}
                    </p>                
                    <a href=${url} style="background: #5499C7; text-decoration: none; color: white; padding: 8px 15px; margin: 5px 0; display: inline-block;">
                        ${action}
                    </a>
                    <p>
                        If you did not create an account, no further action is required.
                    </p>
                    <p>
                        If the button doesn't work for any reason, you can also click on the link below:
                        </br>${url}
                    </p>
                </div>
            `
        });
    }
    catch (err) {
        console.log(err);
    }
};

export default sendEmail;