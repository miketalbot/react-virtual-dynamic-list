import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import PropTypes from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill'
import { heightCalculator } from './height-calculator'
import { useCurrentState } from './use-current-state'
import { DefaultWrapper } from './default-wrapper'
import { noop } from './noop'

const MEASURE_LIMIT = 3

let id = 0
const scrollEventParams = {
    items: null,
    scrollTop: 0,
    start: 0,
    last: 0,
    max: 0,
    scroller: null,
}

export const Virtual = React.forwardRef(function Virtual(
    {
        items,
        scrollToItem,
        useAnimation = true,
        onInit = noop,
        expectedHeight = 64,
        scrollTop = 0,
        onScroll = noop,
        renderItem,
        className,
        overscan = 1,
        Holder = DefaultWrapper,
        Wrapper = DefaultWrapper,
        ...props
    },
    passRef
) {
    let stateRef = useRef({
        cache: new Map(),
        positions: [],
        render: 0,
        heights: [],
        measured: 1,
        scroll: 0,
        scrollUpdate: noop,
        measuredHeights: expectedHeight,
        itemHeight: expectedHeight,
        componentHeight: 1000,
    })
    const state = stateRef.current

    let key
    if (!Array.isArray(items)) {
        items = { length: items, useIndex: true }
    }

    useAnimation = useAnimation || scrollToItem

    const last = useRef({
        item: -1,
        id: 0,
        counter: 0,
        renders: [],
        others: [],
    })
    return (
        <Frame
            scrollTop={scrollTop}
            state={state}
            useAnimation={useAnimation}
            items={items}
            status={last.current}
            scrollToItem={scrollToItem}
            className={className}
            overscan={overscan}
            Holder={Holder}
            onScroll={onScroll}
            Wrapper={Wrapper}
            renderItem={renderItem}
            passRef={passRef}
            {...props}
        />
    )
})

function Frame({
    scrollTop,
    state,
    useAnimation,
    status,
    items,
    className,
    scrollToItem,
    overscan,
    onScroll,
    passRef,
    Wrapper,
    Holder,
    renderItem,
    ...props
}) {
    const [hc] = useState(() => heightCalculator(getHeightOf))
    let [currentHeight, setHeight] = useCurrentState(1000)

    const [scrollPos, setScrollPos] = useCurrentState(scrollTop || state.scroll)
    const scrollInfo = useRef({ lastItem: 0, lastPos: 0 })
    const endRef = useRef()

    let offset = Math.min(
        10000000,
        scrollInfo.current.lastPos +
            (items.length - scrollInfo.current.lastItem) * state.itemHeight
    )
    useEffect(() => {
        console.log('Will effevt')
        state.scroller.scrollTop = scrollPos
        if (!useAnimation) return
        const control = { running: true, beat: 0 }
        requestAnimationFrame(animate(control))
        return () => {
            control.running = false
        }
    }, [])

    return (
        <Holder
            {...props}
            className={className}
            state={state}
            onScroll={scroll}
            ref={componentHeight}
            style={{
                ...props,
                ...props.style,
                WebkitOverflowScrolling: 'touch',
                position: 'relative',
                display: props.display || 'block',
                width: props.width || '100%',
                height: props.height || '100%',
                flexGrow: props.flexGrow || 1,
                overflowX: 'hidden',
                minHeight: props.minHeight || 2,
                maxHeight: props.maxHeight || '100vh',
                overflowY: 'auto',
            }}
        >
            <div ref={endRef} style={{ marginTop: offset - 1, height: 1 }} />
            <div
                style={{
                    position: 'absolute',
                    overflow: 'visible',
                    height: 0,
                    width: '100%',
                    top: 0,
                }}
            >
                <Items
                    end={endRef}
                    state={state}
                    status={status}
                    hc={hc}
                    getHeightOf={getHeightOf}
                    getItemFromPosition={getItemFromPosition}
                    getPositionOf={getPositionOf}
                    overscan={overscan}
                    currentHeight={currentHeight}
                    items={items}
                    onScroll={onScroll}
                    Wrapper={Wrapper}
                    renderItem={renderItem}
                    from={scrollPos}
                    scrollInfo={scrollInfo.current}
                />
            </div>
        </Holder>
    )

    function componentHeight(target) {
        if (target) {
            passRef && passRef(target)
            state.componentHeight = target.offsetHeight
            setHeight(target.offsetHeight)
            state.scroller = target
            target._component = true
            target.scrollTop = scrollTop
        }
    }

    function getPositionOf(item) {
        if (item < 0 || item > items.length - 1) return 0
        if (state.measured < MEASURE_LIMIT) {
            return state.itemHeight * item
        }
        return hc && hc(item)
    }

    function getItemFromPosition(from) {
        if (from < 0) return 0
        let start = 0
        let end = items.length
        let max = Math.abs(Math.log2(end) + 1)
        let c = 0
        let middle
        do {
            middle = (((end - start) / 2) | 0) + start
            let posStart = getPositionOf(middle)
            let posEnd = posStart + getHeightOf(middle)
            if (posStart <= from && posEnd > from) return middle
            if (posStart > from) {
                end = middle
            } else {
                start = middle
            }
        } while (c++ < max)
        return middle
    }

    function getHeightOf(item) {
        let height = state.heights[item]
        return height !== undefined ? height : state.itemHeight
    }
    function animate(control) {
        console.log('start')
        control.count = 0
        function inner() {
            if (state.scroller && state.scroller.scrollTop != 0) {
                state.scroll = state.scroller.scrollTop
            }

            control.beat++
            if (scrollToItem && control.count++ < 8) {
                let pos = getPositionOf(scrollToItem)
                state.scroller.scrollTop = pos
            } else {
                scrollToItem = undefined
            }
            if ((control.beat & 3) === 0) {
                state.scrollUpdate(state.scroller.scrollTop)
            }
            if (control.running) requestAnimationFrame(inner)
        }

        return inner
    }

    function scroll(event) {
        state.scroll = event.target.scrollTop
        state.scrollUpdate(state.scroll)
    }
}

function Items({
    from,
    scrollInfo,
    status,
    getPositionOf,
    state,
    getItemFromPosition,
    overscan,
    onScroll,
    renderItem,
    getHeightOf,
    currentHeight,
    Wrapper,
    hc,
    items,
}) {
    let [scrollPos, setScrollPos] = useCurrentState(from)
    state.scrollUpdate = setScrollPos
    let item = Math.max(
        0,
        getItemFromPosition(
            scrollPos -
                Math.min(
                    state.itemHeight * 10,
                    state.componentHeight * overscan
                )
        )
    )
    const updatedPosition = getPositionOf(status.item)
    const diff = updatedPosition - status.y
    if (diff) {
        state.scroller.scrollTop += diff
        status.y = updatedPosition
        scrollPos += diff
    }

    if (status.item !== item) {
        status.item = item
        state.render++
        let y = (status.y = getPositionOf(item))

        const renders = status.renders
        const others = status.others

        others.length = 0
        renders.length = 0
        for (let i = Math.max(0, item - ((3 * overscan) | 0)); i < item; i++) {
            others.push(render(i))
        }
        y -= scrollPos
        let scan = item
        let maxY = currentHeight * (overscan + 0.5) + (state.render < 2 ? 2 : 0)
        console.log(y + scrollPos, maxY + scrollPos)
        while (y < maxY && scan < items.length) {
            renders.push(render(scan))
            y += getHeightOf(scan)
            scan++
        }
        if (scan >= scrollInfo.lastItem) {
            scrollInfo.lastItem = scan
            scrollInfo.lastPos = y + scrollPos
        }
        status.scan = scan
    }

    scrollEventParams.items = items
    scrollEventParams.scrollTop = scrollPos
    scrollEventParams.start = item
    scrollEventParams.last = status.scan
    scrollEventParams.max = scrollInfo.lastItem
    scrollEventParams.scroller = state.scroller
    onScroll(scrollEventParams)
    status.from = scrollPos

    return (
        <Wrapper style={{ transform: `translateY(${status.y}px)` }}>
            {status.renders}
        </Wrapper>
    )
    function render(item) {
        const cache = state.cache
        if (cache.has(item)) return cache.get(item)
        const toRender = !items.useIndex ? items[item] : item
        let result =
            !!toRender || items.useIndex ? (
                <Item item={item} key={item} toRender={toRender} />
            ) : null
        cache.set(item, result)
        return result

        function Item({ item, toRender }) {
            let observer = new ResizeObserver((entries) => {
                const entry = entries[0]
                const height = entry.contentRect.height
                if (state.heights[item] !== height) {
                    if (state.measured === 1) {
                        state.measuredHeights = height
                        state.measured++
                    } else {
                        state.measuredHeights += height
                        state.measured++
                    }
                    state.itemHeight =
                        state.measuredHeights / Math.max(1, state.measured - 1)
                    state.heights[entry.target._item] = height

                    if (state.measured < MEASURE_LIMIT) {
                        hc.invalidate(-1)
                    } else {
                        hc.invalidate(entry.target._item)
                    }
                }
            })
            useEffect(() => {
                return () => {
                    observer.disconnect()
                    console.log('unmount', item)
                }
            })
            const value = useMemo(() => renderItem(toRender, item))
            return <div ref={observe}>{value}</div>
            function observe(target) {
                if (target) {
                    target._item = item
                    observer.observe(target)
                }
            }
        }
    }
}

Virtual.propTypes = {
    Wrapper: PropTypes.func,
    display: PropTypes.any,
    expectedHeight: PropTypes.number,
    flexGrow: PropTypes.any,
    height: PropTypes.any,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    maxHeight: PropTypes.any,
    minHeight: PropTypes.any,
    onScroll: PropTypes.func,
    overscan: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollTop: PropTypes.number,
    useAnimation: PropTypes.bool,
    width: PropTypes.any,
}
