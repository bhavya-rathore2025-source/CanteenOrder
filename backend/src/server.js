import { app } from './app.js'
import { poolPromise } from './db/sql.js'
const PORT = 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
