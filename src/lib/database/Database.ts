import { createClient } from "@libsql/client"

const client = createClient({
    url: import.meta.env.VITE_TURSO_URL!,
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN
})

export default client