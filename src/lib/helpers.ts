import type { ElementCategory } from "./models/Element"

export function handle_error(err: Error) {
    console.error(err)
}

export function capitalize(
    str: string,
    options = {
        allWords: false,
        preserveCase: false,
    }
) {
    if (typeof str !== "string" || str.length === 0) {
        return str
    }

    if (options.allWords) {
        return str
            .split(" ")
            .map((word) => {
                if (word.length === 0) return word
                const firstChar = word.charAt(0).toUpperCase()
                const rest = options.preserveCase
                    ? word.slice(1)
                    : word.slice(1).toLowerCase()
                return firstChar + rest
            })
            .join(" ")
    }

    const firstChar = str.charAt(0).toUpperCase()
    const rest = options.preserveCase
        ? str.slice(1)
        : str.slice(1).toLowerCase()
    return firstChar + rest
}

export function get_main() {
    return document.getElementById("main")!
}

export function normalize_category(category: ElementCategory) {
    return category.replaceAll(' ', '_')
}