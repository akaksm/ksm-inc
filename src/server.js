import app from "./app.js";
import dotenv from 'dotenv/config'

import configDb from "./config/db.js";

const port = process.env.PORT;

configDb(
    app.listen(port, () => {
        `server started on port ${port}`
    })
);


