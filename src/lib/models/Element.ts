
export enum ElementCategory {
    HYDROGEN = "hidrogênio",
    NOBLE_GAS = "gás nobre",
    ALKALI_METAL = "metal alcalino",
    ALKALINE_EARTH_METAL = "metal alcalino terroso",
    SEMIMETAL = "semimetal",
    NONMETAL = "ametal",
    TRANSITION_METAL = "metal de transição",
    POST_TRANSITION_METAL = "outros metais",
    LANTHANIDE = "lantanídeo",
    ACTINIDE = "actinídeo",
    UNKNOWN = "desconhecido",
}

enum Phase {
    GAS = "G",
    SOLID = "S",
    LIQUID = "L",
}

export interface ElementPayload {
    atomic_number: number
    oficial_name: string
    atomic_radius?: number
    category: ElementCategory
    atomic_mass: number
    eletronegativity?: number
    period: number
    family: number
    symbol: string
    fase?: Phase
    xpos: number
    ypos: number
    layers: string
    eletronic_configuration?: string
    oxidation_states: number[]
    discovery: string[]
    discovery_year?: number
    another_names: string[]
    latin_name?: string
    name_meaning?: string
}
