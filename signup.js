import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    // 1. Check if username is already taken
    const existing = await redis.get(`username:${username.toLowerCase()}`);
    if (existing) {
        return res.status(400).json({ error: "Username already taken" });
    }

    // 2. Increment global user ID counter (starts at 1)
    const newUserId = await redis.incr('global_user_id');

    const userData = {
        id: newUserId,
        username: username,
        password: password, // Note: Hash in production
        created_at: new Date().toISOString(),
        status: "Welcome to EBURG!"
    };

    // 3. Save key for ID (e.g. user:1)
    await redis.set(`user:${newUserId}`, JSON.stringify(userData));

    // 4. Save lookup key for Username -> ID mapping
    await redis.set(`username:${username.toLowerCase()}`, newUserId);

    return res.status(200).json({ success: true, userId: newUserId });
}
