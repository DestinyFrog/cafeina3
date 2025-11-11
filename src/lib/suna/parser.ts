
export interface LoopFunctionData {
    current_index: number
    parent_index: number | null,
    me: string,
    parent: string | null,
    brothers: string[],
    children: string[],
    order_child: number | null
}

abstract class Parser {
    private symbols: string[] = []
    private ligations: string[][] = []

    public parse(data: string) {
        const [ line_atom, ... lines_ligations ] = data.split('\n')
        if (!line_atom) throw new Error("Linha dos atomos não definida")

        const symbols = line_atom.match(/[A-Z][a-z]?/g)
        if (!symbols) throw new Error("Linha dos atomos em formato inválido")
        this.symbols = symbols

        this.ligations = lines_ligations.map(line => line.split(''))
    }

    public async loop(fn: (data: LoopFunctionData) => Promise<void>,
        current_index = 0,
        parent_index: number | null = null,
        order_child: number | null = null,
        historic: number[] = []
    ) {
        if (historic.includes(current_index)) return

        await fn({
            current_index,
            parent_index,
            me: this.symbols[current_index],
            parent: parent_index ? this.symbols[parent_index] : null,
            brothers: (parent_index ? this.ligations[parent_index] : [])
                .reduce((prev, cur, idx) =>
                (cur != ' ' && idx != current_index && !historic.includes(idx))
                    ? [... prev, this.symbols[idx] ]
                    : prev
                , [] as string[]),
            children: this.ligations[current_index]
                .reduce((prev, cur, idx) =>
                    (cur != ' ' && idx != current_index && !historic.includes(idx))
                        ? [...prev, this.symbols[idx]]
                        : prev
                    , [] as string[]),
            order_child
        })

        let count = 0
        this.ligations[current_index].forEach(
            (has_ligacao, ligation_index) => {
                if (has_ligacao == ' ') return
                count++
                this.loop(fn, ligation_index, current_index, count, [... historic, current_index])
            }
        )
    }

    public abstract run(data: string): void
}

export default Parser