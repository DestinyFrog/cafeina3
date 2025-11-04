import { createClient } from "@libsql/client"
import dotenv from 'dotenv'
import fs from 'node:fs'

const args = process.argv.slice(2);
dotenv.config()

function get_client() {
    const obj = process.env.VITE_MODE === 'production'
        ? {
            url: process.env.VITE_TURSO_URL,
            authToken: process.env.VITE_TURSO_AUTH_TOKEN
        }
        : { url: process.env.VITE_LOCAL_TURSO_URL }

    return createClient(obj)
}

async function get_runned_migrations(client) {
    const exists = await client.execute(`
        SELECT EXISTS (
            SELECT 1 FROM sqlite_master 
            WHERE type='table' AND name='migration'
        ) as table_exists;
    `);

    if (exists.rows[0].table_exists === 0) {
        return [];
    }

    const res = await client.execute('SELECT name FROM migration ORDER BY name DESC');
    return res.rows.map(row => row.name);
}

async function up() {
    const client = get_client()

    try {
        const migrations_already_run = await get_runned_migrations(client)

        const files = fs.readdirSync('./migrations')
        const migration_up_files = files
            .filter(filename =>
                filename.endsWith('.up.sql') &&
                !migrations_already_run.some(mig => filename.startsWith(mig)))
            .sort()

        console.log(`Encontradas ${migration_up_files.length} migrations para executar`)

        for (const filename of migration_up_files) {
            console.log(`Executando migration: ${filename}`)
            
            const sql = fs.readFileSync(`./migrations/${filename}`, { encoding: 'utf8' })
            await client.executeMultiple(sql)

            const crude_filename = filename.replace('.up.sql', '')
            await client.execute({
                sql: 'INSERT INTO migration (name) VALUES (?)',
                args: [crude_filename]
            })
            
            console.log(`✓ Migration ${filename} executada com sucesso`)
        }

        console.log('Todas as migrations foram executadas')
    } catch (error) {
        console.error('Erro durante a execução das migrations UP:', error)
        throw error
    }
}

async function down() {
    const client = get_client()

    try {
        const migrations_already_run = await get_runned_migrations(client)

        if (migrations_already_run.length === 0) {
            console.log('Nenhuma migration para reverter')
            return
        }

        for (const filename of migrations_already_run.reverse()) {
            const real_filename = `./migrations/${filename}.down.sql`
            
            if (!fs.existsSync(real_filename)) {
                console.log(`⚠ Arquivo DOWN não encontrado para: ${filename}, pulando...`)
                continue
            }

            console.log(`Revertendo migration: ${filename}`)
            
            const sql = fs.readFileSync(real_filename, { encoding: 'utf8' })
            await client.executeMultiple(sql)
            
            await client.execute({
                sql: 'DELETE FROM migration WHERE name = ?',
                args: [filename]
            })
            
            console.log(`✓ Migration ${filename} revertida com sucesso`)
        }

        console.log('Todas as migrations foram revertidas')
    } catch (error) {
        console.error('Erro durante a execução das migrations DOWN:', error)
        throw error
    }
}

async function main() {
    if (args.length === 0) {
        console.log('Uso: node migration.js [up|down]')
        process.exit(1)
    }

    try {
        switch (args[0]) {
            case 'up':
                await up()
                break

            case 'down':
                await down()
                break

            default:
                console.log('Comando inválido. Use "up" ou "down"')
                process.exit(1)
        }
    } catch (error) {
        console.error('Falha na execução:', error)
        process.exit(1)
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main()
}

export { up, down, get_runned_migrations }