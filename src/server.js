import app from "./app.js";
import connectDb from "./config/db.js";
import { port } from "./config/index.js";

const DB = await connectDb()

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})


