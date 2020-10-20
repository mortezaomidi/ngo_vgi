const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: 'mongodb+srv://NGODB:NGODB@cluster0.lq4cp.mongodb.net/NGODB?retryWrites=true&w=majority'
}

export default config;
