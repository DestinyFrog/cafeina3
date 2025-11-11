
class Svg {
    constructor(
        private border = 20,
        private lines: string[] = [],
        private min_x: number = 0,
        private min_y: number = 0,
        private max_x: number = 0,
        private max_y: number = 0
    ) {}

    private set_max_bounds(x: number, y: number) {
        this.min_x = Math.min(this.min_x, x)
        this.min_y = Math.min(this.min_y, y)
        this.max_x = Math.max(this.max_x, x)
        this.max_y = Math.max(this.max_y, y)
    }

    public text (text: string, x: number, y: number) {
        this.set_max_bounds(x, y)
        this.lines.push(`<text class="svg-element svg-element-${text}" x="${Math.floor(x)}" y="${Math.floor(y)}">${text}</text>`)
    }

    public line (ax: number, ay: number, bx: number, by: number, spacing = 0) {
        if (spacing > 0) {
            const angle = Math.atan2(by - ay, bx - ax)
            ax = Math.cos(angle) * spacing
            ay = Math.sin(angle) * spacing
            bx = Math.cos(Math.PI + angle) * spacing
            by = Math.sin(Math.PI + angle) * spacing
        }

        this.set_max_bounds(ax, ay)
        this.set_max_bounds(bx, by)
        this.lines.push(`<line class="svg-ligation" x1="${Math.floor(ax)}" y1="${Math.floor(ay)}" x2="${Math.floor(bx)}" y2="${Math.floor(by)}"></line>`)
    }

    private async load_svg_template() {
        const res = await fetch("/suna.temp.svg")
        const data = await res.text()
        return data
    }

    private async load_css_template() {
        const res = await fetch("/suna.css")
        const data = await res.text()
        return data
    }

    public async arquitetar() {
        const svg_template = await this.load_svg_template()
        const css_template = await this.load_css_template()

        const width = this.max_x + Math.abs(this.min_x) + this.border * 2
        const height = this.max_y + Math.abs(this.min_y) + this.border * 2
        const svg = this.lines.join("\n\t");

        return svg_template
            .replace('start_x', (this.min_x - this.border).toString())
            .replace('end_x', width.toString())
            .replace('start_y', (this.min_y - this.border).toString())
            .replace('end_y', height.toString())
            .replace('css', css_template)
            .replace('content', svg)
    }
}

export default Svg