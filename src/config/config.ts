import { config as conf } from "dotenv";

conf();

const _config={
    port:process.env.PORT,
    mongouri:process.env.MONGOURI,
    env:process.env.NODE_ENV,
    jwtSecretKey:process.env.JWT_SECRET_KEY
}

export const config=Object.freeze(_config);