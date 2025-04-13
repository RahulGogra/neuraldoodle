import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, email }
        next();
    } catch (err) {
        return res
            .status(403)
            .json({ error: "Invalid or expired token." + err });
    }
}
