// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { logUserIn } from "../../controllers/auth/auth";

export default async function logIn(req, res) {
    if (req.method === "POST" && req.body.username && req.body.password) {
        const { username, password, was } = req.body;
        try {
            // console.log({was})
            let lui = await logUserIn(req, res, { "username": username, "password": password }, was);
            if (lui && lui.token) {
                res.json(lui);
            } else {
                res.status(401).json({
                    "error": "Invalid credentials"
                });
            }
        } catch (err) {
            console.log("logIn API error: ", err)
            res.status(500).json({
                "error": err.message
            });
        }
    } else {
        res.status(400).json({
            "error": "Invalid request"
        });
    }
}
