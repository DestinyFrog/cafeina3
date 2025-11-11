
const BORDER = 10

class Svg {
    constructor() {
        this.elementos = []
    }

    texto(info) {
        this.elementos.push(Object.assign({
            count_as_size: true,
            tipo: "texto",
            classe: "texto",
            size: 12,
            x: 0,
            y: 0,
        }, info))
    }

    linha(info) {
        const espaçamento = info.espaçamento ?? 7
        const dx = info.bx - info.ax;
        const dy = info.by - info.ay;
        const comprimento = Math.sqrt(dx * dx + dy * dy);

        const ux = dx / comprimento;
        const uy = dy / comprimento;

        info.ax = info.ax + ux * espaçamento;
        info.ay = info.ay + uy * espaçamento;
        info.bx = info.bx - ux * espaçamento;
        info.by = info.by - uy * espaçamento;

        this.elementos.push(Object.assign({
            count_as_size: false,
            tipo: "linha",
            classe: "linha",
            h: 2,
            ax: 0,
            ay: 0,
            bx: 0,
            by: 0,
        }, info))
    }

    arquitetar() {
        const svg_template_file = fs.readFileSync("./suna.temp.svg", { encoding: "utf-8" })
        const css = fs.readFileSync("./suna.css", { encoding: "utf-8" })

        const ax = this.elementos.reduce((prev, o) =>
            o.count_as_size ? [...prev, o.x] : prev, [])

        const ay = this.elementos.reduce((prev, o) =>
            o.count_as_size ? [...prev, o.y] : prev, [])

        const min_x = Math.min(...ax)
        const min_y = Math.min(...ay)
        const max_x = Math.max(...ax)
        const max_y = Math.max(...ay)

        let svg = this.elementos.map(
            el => {
                switch (el.tipo) {
                    case 'texto':
                        return `<text class="svg-element svg-element-${el.classe}" x="${parseInt(el.x)}" y="${parseInt(el.y)}">${el.texto}</text>`

                    case 'linha':
                        return `<line class="svg-ligation" x1="${parseInt(el.ax)}" y1="${parseInt(el.ay)}" x2="${parseInt(el.bx)}" y2="${parseInt(el.by)}" filter="url(#doubleLine)"></line>`
                }
            }
        ).join("\n\t")

        return svg_template_file
            .replace('start_x', min_x - BORDER)
            .replace('start_y', min_y - BORDER)
            .replace('end_x', max_x + Math.abs(min_x) + BORDER * 2)
            .replace('end_y', max_y + Math.abs(min_y) + BORDER * 2)
            .replace('css', css)
            .replace('content', svg)
    }
}

export default Svg