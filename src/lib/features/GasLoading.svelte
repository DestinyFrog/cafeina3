<script lang="ts">
    import { onMount } from "svelte"

    let {
        particles_qtd = 8
    }: {
        particles_qtd?: number
    } = $props()

    interface Particle {
        id: number
        x: number
        y: number
        vx: number
        vy: number
    }

    let particles: Particle[] = $state([])

    onMount(() => {
        particles = Array(particles_qtd)
            .fill(0)
            .map((_, i) => ({
                id: i,
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
            }))

        const animate = () => {
            particles = particles.map((p) => {
                let { x, y, vx, vy, id } = p

                x += vx
                y += vy

                if (x <= 10 || x >= 90) vx = -vx
                if (y <= 10 || y >= 90) vy = -vy

                x = Math.max(10, Math.min(90, x))
                y = Math.max(10, Math.min(90, y))

                return { id, x, y, vx, vy }
            })

            requestAnimationFrame(animate)
        }

        animate()
    })
</script>

<div class="particle-loader">
    <div class="particle-container">
        {#each particles as particle}
            <div class="particle" style="left: {particle.x}%; top: {particle.y}%"></div>
        {/each}
    </div>
</div>

<style>
    .particle-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .particle-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 80px;
        min-height: 80px;
        background: #f8f9fa;
    }

    .particle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #ff6b6b;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 6px #ff6b6b;
        transition: all 0.1s linear;
    }
</style>
