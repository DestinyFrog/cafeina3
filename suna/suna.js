import fs from 'fs'
import Svg from 'svg'

const POINT = ' '
const BORDER = 10

const angulos = {
    "s": [0],
    "sp": [180, 0],
    "sp2": [90, 330, 210],
    "sp3": [340, 250, 200, 90],
    "sp3d": [-10, 250, 190, 90],
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
                (cur != POINT && idx != indice_atual && !historico.includes(idx))
                    ? [...prev, atomos[idx]]
                    : prev
                , []),
        filhos: ligacoes[indice_atual]
            .reduce((prev, cur, idx) =>
                (cur != POINT && idx != indice_atual && !historico.includes(idx))
                    ? [...prev, atomos[idx]]
                    : prev
                , []),
        n_filho
    })

    let count = 0
    ligacoes[indice_atual].forEach(
        (has_ligacao, indice_ligacao) => {
            if (has_ligacao == POINT) return
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

function eletronsValenciaFromDistribuicao(distribuicao) {
    const ultimoSubnivel = distribuicao.trim().split(' ').pop();
    const match = ultimoSubnivel.match(/(\d+)([spdf])(\d+)/);
    
    if (match) {
        return parseInt(match[3]);
    }
    
    return 0;
}

function calcular_hibidrizacao(simbolo, grau) {
    const distribuicao = d
    const valencia = eletronsValenciaFromDistribuicao()
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
            data.eu.x = parseInt(data.pai.x + Math.cos(angulo * (Math.PI / 180)) * 24)
            data.eu.y = parseInt(data.pai.y + Math.sin(angulo * (Math.PI / 180)) * 24)
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
fs.writeFileSync('../public/output.svg', str_svg)