import express from "express"
import cors from "cors"
import { routes } from "./routes"
import { errorMiddleware } from "./middlewares/errorMiddleware"
import "dotenv/config"

const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})