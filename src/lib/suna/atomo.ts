import client from "../database/Database"

class Atom {
    public static eletronic_configuration_to_valence_electrons(distribuicao_eletronica: string) {
        const last_sublayer = distribuicao_eletronica.trim().split(" ").pop()!
        const match = last_sublayer.match(/(\d+)([spdf])(\d+)/)
        if (match) return parseInt(match[3])
        return 0
    }

    public static async calc_hibridization(symbol: string, ligations_number: number) {
        const res = await client.execute("SELECT eletronic_configuration FROM element WHERE symbol = $1", [symbol])
        if (res.rows.length < 1) throw new Error("Elemento não encontrado")

        const eletronic_configuration = res.rows[0].eletronic_configuration as string
        const valence_electrons = Atom.eletronic_configuration_to_valence_electrons(eletronic_configuration)

        let lone_pairs = (valence_electrons - ligations_number) / 2
        if (lone_pairs < 0) lone_pairs = 0
        const steric_number = ligations_number + lone_pairs

        const hibridization_str = "sp3d2"
        return hibridization_str.split("").slice(1, steric_number).join("")
    }
}

export default Atom