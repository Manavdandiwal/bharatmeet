import nodemailer from "nodemailer";

const sendUserCreationEmail = async (userEmail, password) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rajancoding597@gmail.com",
                pass: "funzmtuwnobqjvya", // Use a secure method to store and access passwords
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        let info = await transporter.sendMail({
            from: '"BharatMeet" <manavdandiwal1111@gmail.com>',
            to: userEmail,
            subject: "User Access created",
            text: `Admin has granted access to BharatMeet`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f7f7f7;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                color: #333;
                            }
                            p {
                                color: #555;
                            }
                            .button {
                                display: inline-block;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                transition: background-color 0.3s;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>Access for BharatMeet has been granted.</p>
                            <p>Your credential are: </p>
                            <p>Email: ${userEmail}</p>
                            <p>Password: ${password}</p>
                            <br />
                            <p>Please change you password as soon as possible</p>
                        </div>
                    </body>
                </html>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (err) {
        console.error(err); // Log error for debugging
        return { success: false, error: err };
    }
};

export default sendUserCreationEmail;
