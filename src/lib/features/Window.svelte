<script lang="ts">
    const {
        title,
        content,
        footer,
        start_x = 0,
        start_y = 0,
        background_color = "white",
    }: {
        title: string,
        content: Function,
        footer?: Function,
        start_x?: number,
        start_y?: number,
        background_color?: string,
    } = $props()

    let is_dragging = false

    let x = $state(start_x)
    let y = $state(start_y)
    let offset_x = $state(0)
    let offset_y = $state(0)

    function mouseDown(event: MouseEvent) {
        offset_x = x - event.clientX
        offset_y = y - event.clientY

        is_dragging = true
    }

    function windowMouseMove(event: MouseEvent) {
        if (!is_dragging) return

        const newX = event.clientX + offset_x;
        const newY = event.clientY + offset_y;
        
        const maxX = window.innerWidth - this_window.offsetWidth;
        const maxY = window.innerHeight - this_window.offsetHeight;
        
        x = Math.max(0, Math.min(newX, maxX));
        y = Math.max(0, Math.min(newY, maxY));

        x = event.clientX + offset_x
        y = event.clientY + offset_y
    }

    function windowMouseUp(_event: MouseEvent) {
        is_dragging = false
    }

    function touchStart(event: TouchEvent) {
        offset_x = x - event.touches[0].clientX
        offset_y = y - event.touches[0].clientY

        is_dragging = true
    }

    function windowTouchMove(event: TouchEvent) {
        if (!is_dragging) return

        if (is_dragging) {
            x = event.touches[0].clientX + offset_x
            y = event.touches[0].clientY + offset_y
        }
    }

    function windowTouchEnd(_event: TouchEvent) {
        is_dragging = false
    }

    let this_window: HTMLDivElement
    function destroy() {
        this_window.remove()
    }
</script>

<svelte:window
    on:mousemove={(ev) => windowMouseMove(ev)}
    on:mouseup={(ev) => windowMouseUp(ev)}
    on:touchmove={(ev) => windowTouchMove(ev)}
    on:touchend={(ev) => windowTouchEnd(ev)}
/>

<div class="window" bind:this={ this_window }
    style="background-color: {background_color}"
    style:top={`${y}px`}
    style:left={`${x}px`}
    >
    <div class="window-header"
        aria-hidden="true"
        onmousedown={(ev) => mouseDown(ev)}
        ontouchstart={(ev) => touchStart(ev)}>
        <p class="window-label">{ title }</p>
        <button class="window-closer" onclick={ destroy } aria-label="Close Window"></button>
    </div>

    <div class="window-container"
        style:backgroundColor={background_color}>
        {@render content()}
    </div>

    <div class="window-footer">
        {@render footer?.()}
    </div>
</div>

<style scoped lang="scss">
    .window {
        position: absolute;
        width: min-content;
        height: min-content;
        border: 2px solid black;
    }

    .window-header {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 4px;
        color: aliceblue;
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        border-bottom: 2px solid black;
    }

    .window-header p {
        text-align: center;
        width: 100%;
        cursor: move;
    }

    .window-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .window-closer {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid black;
        background-color: rgb(255, 87, 87);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .window-footer {
        height: auto;
        display: flex;
        flex-direction: row;
        border-top: 2px solid black;
    }
</style>
