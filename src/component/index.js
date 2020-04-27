import React, {useEffect, useRef, useState,} from 'react'
import PropTypes from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill'
import {heightCalculator} from './height-calculator'
import {useCurrentState} from './use-current-state'
import {DefaultWrapper} from './default-wrapper'
import {noop} from './noop'
import {useMeasurement} from './use-measurement'
import {ScrollIndicatorHolder} from './scroll-indicator'

export {useMeasurement, useCurrentState, ScrollIndicatorHolder}

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
    let [state] = useState(() => {
        scrollEventParams.items = items
        scrollEventParams.getPositionOf = getPositionOf
        scrollEventParams.getHeightOf = getHeightOf
        scrollEventParams.getItemFromPosition = getItemFromPosition
        const cache = (scrollEventParams.itemCache = new Map())
        onInit(scrollEventParams)
        return {
            cache,
            positions: [],
            render: 0,
            hc: heightCalculator(getHeightOf),
            heights: [],
            measured: 1,
            redraw: false,
            scroll: scrollTop,
            refresh: noop,
            scrollUpdate: noop,
            measuredHeights: expectedHeight,
            itemHeight: expectedHeight,
            componentHeight: 1000,
            item: -1,
            id: 0,
            counter: 0,
            renders: [],
            others: [],
        }
    })

    if (!Array.isArray(items)) {
        items = { length: items, useIndex: true }
    }
    items._id = items._id || id++
    if (items._id !== state.lastId || items.length !== state.lastLength) {
        state.lastId = items._id
        state.lastLength = items.length
        state.cache.clear()
        state.redraw = true
    }
    useAnimation = useAnimation || scrollToItem

    const [{height: currentHeight}, attach] = useMeasurement()
    if(state.currentHeight !== currentHeight) {
        state.redraw = true
        state.currentHeight = currentHeight
    }

    const [scrollPos] = useCurrentState(scrollTop || state.scroll)
    const scrollInfo = useRef({ lastItem: 0, lastPos: 0 })
    const endRef = useRef()

    let offset = Math.min(
        10000000,
        scrollInfo.current.lastPos +
            (items.length - scrollInfo.current.lastItem) * state.itemHeight
    )
    useEffect(() => {
        state.scroller.scrollTop = scrollPos
        if (!useAnimation) return
        const control = { running: true, beat: 0 }
        requestAnimationFrame(animate(control))
        return () => {
            control.running = false
        }
    }, [useAnimation, scrollPos])

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
                scrollTop: state.scroll,
                display: props.display || 'block',
                width: props.width || '100%',
                height: props.height || '100%',
                flexGrow: props.flexGrow,
                overflowX: 'hidden',
                minHeight: props.minHeight,
                maxHeight: props.maxHeight,
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
            attach && attach(target)
            state.scroller = target
            target._component = true
            target.scrollTop = state.scroll
        }
    }

    function getPositionOf(item) {
        if (item < 0 || item > items.length - 1) return 0
        if (state.measured < MEASURE_LIMIT) {
            return state.itemHeight * item
        }
        return state.hc(item)
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
        control.count = 0
        function inner() {
            if (state.scroller && state.scroller.scrollTop !== 0) {
                state.scroll = state.scroller.scrollTop
            }

            control.beat++
            if(control.count < 5) {
                state.scroller.scrollTop = state.scroll
            }
            if (scrollToItem && control.count++ < 8) {
                let pos = getPositionOf(scrollToItem)
                state.scroller.scrollTop = pos
            } else {
                scrollToItem = undefined
            }
            if ((control.beat & 3) === 0) {
                state.scroll = state.scroller.scrollTop
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
})

function Items({
    from,
    scrollInfo,
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

    const [id, refresh] = useState(0)
    state.refresh = () => refresh(id + 1)
    let [, setScrollPos] = useCurrentState(from)
    let scrollPos = state.scroll
    state.scroll = state.from = scrollPos
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
    const updatedPosition = getPositionOf(state.item)
    const diff = state.redraw ? 0 : updatedPosition - state.y
    if (diff) {
        scrollPos += diff
        state.scroller.scrollTop = scrollPos
        state.y = updatedPosition

    }

    if (state.item !== item || state.redraw) {
        state.redraw = false
        state.item = item
        state.render++
        let y = (state.y = getPositionOf(item))

        const renders = state.renders
        const others = state.others

        others.length = 0
        renders.length = 0
        for (let i = Math.max(0, item - ((3 * overscan) | 0)); i < item; i++) {
            others.push(render(i))
        }
        y -= scrollPos
        let scan = item
        let maxY = currentHeight * (overscan + 0.5) + (state.render < 2 ? 2 : 0)
        while (y < maxY && scan < items.length) {
            renders.push(render(scan))
            y += getHeightOf(scan)
            scan++
        }
        if (scan >= scrollInfo.lastItem) {
            scrollInfo.lastItem = scan
            scrollInfo.lastPos = y + scrollPos
        }
        state.scan = scan
    }

    scrollEventParams.items = items
    scrollEventParams.scrollTop = scrollPos
    scrollEventParams.start = item
    scrollEventParams.last = state.scan
    scrollEventParams.max = scrollInfo.lastItem
    scrollEventParams.scroller = state.scroller
    scrollEventParams.getPositionOf = getPositionOf
    scrollEventParams.getHeightOf = getHeightOf
    scrollEventParams.getItemFromPosition = getItemFromPosition
    scrollEventParams.itemCache = state.cache
    onScroll(scrollEventParams)

    return (
        <>
            <Wrapper style={{ height: 0 }}>{state.others}</Wrapper>
            <Wrapper style={{ transform: `translateY(${state.y}px)` }}>
                {state.renders}
            </Wrapper>
        </>
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
                        state.hc.invalidate(-1)
                    } else {
                        state.hc.invalidate(entry.target._item)
                    }
                }
            })
            useEffect(() => {
                return () => {
                    observer.disconnect()
                }
            })
            const value = () => renderItem(toRender, item)
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
