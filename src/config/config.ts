import { config as conf } from "dotenv";

conf();

const _config={
    port:process.env.PORT,
    mongouri:process.env.MONGOURI,
    env:process.env.NODE_ENV,
    jwtSecretKey:process.env.JWT_SECRET_KEY,
    cloudaniry_cloud:process.env.CLOUDANIRY_CLOUD,
    cloudaniry_api_key:process.env.CLOUDANIRY_API_KEY,
    cloudinary_secret:process.env.CLOUDANIRY_SECRET,
    frontendUrl:process.env.FRONTEND_URL
}

export const config=Object.freeze(_config);