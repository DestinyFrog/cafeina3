import Parser, { type LoopFunctionData } from "./parser"
import Atom from "./atomo"
import Svg from "./svg"

interface StandardSvgAtom {
    symbol: string
    x: number
    y: number
    angle: number
    hibridization: string
}

class Standard extends Parser {
    private svg: Svg
    private atoms: Record<number, StandardSvgAtom>

    private angles: Record<string, number[]> = {
        "s": [0],
        "sp": [180, 0],
        "sp2": [90, 330, 210],
        "sp3": [340, 250, 200, 90],
        "sp3d": [-10, 250, 190, 90],
    }

    constructor () {
        super()

        this.svg = new Svg()
        this.atoms = []
    }

    public run(data: string): void {
        this.parse(data)
        this.loop(this.handleData)
    }

    public async handleData (data: LoopFunctionData) {
        let number_ligations = data.children.length
        if (data.parent) number_ligations++

        const atom = {
            x: 0,
            y: 0,
            angle: 0,
            symbol: data.me,
            hibridization: await Atom.calc_hibridization(data.me, number_ligations),
        } as StandardSvgAtom

        if (data.parent_index && data.order_child) {
            const parent = this.atoms[data.parent_index]
            const hibridization = this.angles[parent.hibridization]
            atom.angle = (parent.angle + 180 + hibridization[data.order_child - 1]) % 360
            atom.x = Math.floor(parent.x + Math.cos(atom.angle * (Math.PI / 180)) * 24)
            atom.y = Math.floor(parent.y + Math.sin(atom.angle * (Math.PI / 180)) * 24)

            this.svg.line(atom.x, atom.y, parent.x, parent.y)
        }

        this.svg.text(atom.symbol, atom.x, atom.y)
        this.atoms[data.current_index] = atom
    }
}

export default Standard