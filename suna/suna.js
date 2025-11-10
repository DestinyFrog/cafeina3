import fs from 'fs'

const POINT = '+'
const BORDER = 10

const angulos = {
    "s": [0],
    "sp": [180, 0],
    "sp2": [330, 210, 90],
    "sp3": [340, 250, 200, 90],
    "sp3d": [330, 210, 240, 180],
}

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
                        return `<line class="svg-ligation" x1="${parseInt(el.ax)}" y1="${parseInt(el.ay)}" x2="${parseInt(el.bx)}" y2="${parseInt(el.by)}"></line>`
                }
            }
        ).join("\n\t")

        return svg_template_file
            .replace('%start_x%', min_x - BORDER)
            .replace('%start_y%', min_y - BORDER)
            .replace('%end_x%', max_x + Math.abs(min_x) + BORDER * 2)
            .replace('%end_y%', max_y + Math.abs(min_y) + BORDER * 2)
            .replace('%css%', css)
            .replace('%svg%', svg)
    }
}

function andar(atomos, ligacoes, fn,
    indice_atual = 0, indice_pai = null,
    historico = [], n_filho = null
) {
    if (historico.includes(indice_atual)) return

    fn({
        eu: atomos[indice_atual],
        pai: atomos[indice_pai],
        irmaos: (ligacoes[indice_pai] || [])
            .reduce((prev, cur, idx) =>
                (cur == POINT && idx != indice_atual && !historico.includes(idx))
                    ? [...prev, atomos[idx]]
                    : prev
                , []),
        filhos: ligacoes[indice_atual]
            .reduce((prev, cur, idx) =>
                (cur == POINT && idx != indice_atual && !historico.includes(idx))
                    ? [...prev, atomos[idx]]
                    : prev
                , []),
        n_filho
    })

    let count = 0
    ligacoes[indice_atual].forEach(
        (has_ligacao, indice_ligacao) => {
            if (has_ligacao != POINT) return
            count++
            andar(atomos, ligacoes, fn,
                indice_ligacao, indice_atual,
                [...historico, indice_atual], count)
        }
    )

    return atomos
}

const valencia = {
    H: 1,
    He: 2,
    Li: 1,
    Be: 2,
    B: 3,
    C: 4,
    N: 5,
    O: 6,
    F: 7,
    Ne: 8,
    Na: 1,
    Mg: 2,
    Al: 3,
    Si: 4,
    P: 5,
    S: 6,
    Cl: 7,
    Ar: 8,
    K: 1,
    Ca: 2,
}

function calcular_hibidrizacao(simbolo, grau) {
    const valence_e = valencia[simbolo] || 0;
    
    // Calcular pares de elétrons livres (lone pairs)
    let pares_sozinhos = (valence_e - grau) / 2;
    if (pares_sozinhos < 0) pares_sozinhos = 0;
    
    // Número estérico = número de átomos ligados + pares de elétrons livres
    const numero_esterico = grau + pares_sozinhos;
    
    const hibridizacao = [
        "s",     // 1 - não existe na prática
        "sp",    // 2
        "sp2",   // 3
        "sp3",   // 4
        "sp3d",  // 5
        "sp3d2"  // 6
    ];
    
    // Ajustar índice para o array (começa em 0)
    return hibridizacao[numero_esterico - 1] || "sp3"; // fallback
}

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" })
const [atomos, ...ligacoes] = data.split('\n')
const svg = new Svg()

andar(
    atomos.match(/[A-Z][a-z]?/g).map(simbolo => ({ simbolo })),
    ligacoes.map(line => line.split('')),
    (data) => {
        let grau = data.filhos.length
        if (data.pai && data.pai.simbolo) grau++

        data.eu.hibridizacao = calcular_hibidrizacao(data.eu.simbolo, grau)
        data.eu.x = 0
        data.eu.y = 0
        data.eu.angulo = 0

        if (data.pai) {
            const angulo = (data.pai.angulo + 180 + angulos[data.pai.hibridizacao][data.n_filho - 1]) % 360
            data.eu.angulo = angulo
            data.eu.x = parseInt(data.pai.x + Math.cos(angulo * (Math.PI / 180)) * 30)
            data.eu.y = parseInt(data.pai.y + Math.sin(angulo * (Math.PI / 180)) * 30)
        }

        svg.texto({
            texto: data.eu.simbolo,
            x: data.eu.x,
            y: data.eu.y,
            classe: data.eu.simbolo,
        })

        if (data.pai)
            svg.linha({
                ax: data.eu.x,
                ay: data.eu.y,
                bx: data.pai.x,
                by: data.pai.y,
            })
    }
)

const str_svg = svg.arquitetar()
fs.writeFileSync('output.svg', str_svg)