

import { getUserDetails } from "../../controllers/auth/auth";

export default async function getUser(req, res) {
    if (req.method === "POST" && req.body.token && req.body.url) {
        const { token, url } = req.body;
        try {
            let usr = await getUserDetails(token, url);
            if (usr && usr.token) {
                res.json(usr);
            } else {
                res.status(401).json({
                    "error": "Invalid user"
                });
            }
        } catch (err) {
            console.log("getUser API error: ", err)
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
