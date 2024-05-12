import { config as conf } from "dotenv";

conf();

const _config={
    port:process.env.PORT,
    mongouri:process.env.MONGOURI,
}

export const config=Object.freeze(_config);