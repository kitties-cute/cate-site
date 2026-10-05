import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing ID" });

    let userId = id;

    // If given a username (like "eburg"), look up its numeric ID
    if (isNaN(id)) {
        userId = await redis.get(`username:${id.toLowerCase()}`);
        if (!userId) return res.status(404).json({ error: "User not found" });
    }

    // Fetch user key from Redis
    let rawUser = await redis.get(`user:${userId}`);
    if (!rawUser) return res.status(404).json({ error: "User not found" });

    // Handle JSON object vs String parsing safely
    let user;
    try {
        user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    } catch (e) {
        // Fallback if formatting has backslashes
        user = rawUser;
    }

    return res.status(200).json(user);
}
