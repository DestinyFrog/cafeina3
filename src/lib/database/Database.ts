import { createClient } from "@libsql/client"

const obj = 
    import.meta.env.VITE_MODE == 'production'
    ? {
        url: import.meta.env.VITE_TURSO_URL!,
        authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN
    }
    : { url: import.meta.env.VITE_LOCAL_TURSO_URL! }

const client = createClient(obj)

export default client