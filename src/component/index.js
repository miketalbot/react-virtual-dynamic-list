import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

const MEASURE_LIMIT = 5

function heightCalculator(getHeight) {
    const cache = new Map()

    function calcHeight(v, level = 0) {
        if (v === 0) return 0
        let t = 0
        if ((v & 1) !== 0) {
            t += blockHeight(v - 1, level)
        }
        return t + calcHeight(v >> 1, level + 1)
    }

    calcHeight.invalidate = function (item, level = 0) {
        if (item === -1) {
            cache.clear()
            return
        }
        cache.delete(`${item}:${level}`)
        if (item === 0) return
        calcHeight.invalidate(item >> 1, level + 1)
    }

    function blockHeight(block, level) {
        if (level === 0) {
            return getHeight(block)
        } else if (level < 2) {
            return blockHeight(block << 1, level - 1) + blockHeight(((block << 1) + 1), level - 1)
        } else {
            const key = `${block}:${level}`
            const existing = cache.get(key)
            if (existing !== undefined) {
                return existing
            }
            let result = blockHeight(block << 1, level - 1) + blockHeight(((block << 1) + 1), level - 1)
            cache.set(key, result)
            return result
        }
    }

    return calcHeight


}


const scrollEventParams = {
    items: null,
    scrollTop: 0,
    start: 0,
    last: 0,
    max: 0
}

const DefaultWrapper = React.forwardRef(function DefaultWrapper({children, ...props}, ref) {
    return <div ref={ref} {...props}>{children}</div>
})

function noop() {
}

export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

export function Virtual({items, scrollToItem, useAnimation = true, expectedHeight = 64, scrollTop = 0, onScroll = noop, renderItem, overscan = 1, Holder=DefaultWrapper, Wrapper = DefaultWrapper, ...props}) {
    if (!Array.isArray(items)) {
        items = {length: items, useIndex: true}
    }
    useAnimation = useAnimation || scrollToItem
    let count = 0
    const [hc] = useState(() => heightCalculator(getHeightOf))
    const [, setHeight] = useState(1000)
    const stateRef = useRef({
        cache: new Map(),
        positions: [],
        render: 0,
        heights: [],
        measured: 1,
        scroll: 0,
        measuredHeights: expectedHeight,
        itemHeight: expectedHeight,
        componentHeight: 1000
    })

    const state = stateRef.current


    const last = useRef({item: -1, id: 0, counter: 0, renders: [], others: []})
    const status = last.current
    return <Frame {...props}/>


    function Frame({...props}) {
        const [id, refresh] = useState(0)
        const [scrollPos, setScrollPos] = useState(scrollTop)
        const scrollInfo = useRef({lastItem: 0, lastPos: 0})
        const endRef = useRef()
        let offset = Math.min(10000000, scrollInfo.current.lastPos + ((items.length - scrollInfo.current.lastItem) * state.itemHeight))
        useEffect(() => {
            if (!useAnimation) return
            const control = {running: true, beat: 0}
            requestAnimationFrame(animate(control))
            return () => {
                control.running = false
            }
        })
        state.observer = new ResizeObserver((entries) => {
            let updated = false
            for (let entry of entries) {
                const height = entry.contentRect.height
                if (!height) continue
                if (state.heights[entry.target._item] !== height) {
                    if (state.measured === 1) {
                        state.measuredHeights = height
                        state.measured++
                    } else {
                        state.measuredHeights += height
                        state.measured++
                    }
                    state.itemHeight = state.measuredHeights / Math.max(1, state.measured - 1)
                    updated = true
                    state.heights[entry.target._item] = height

                    if (state.measured < MEASURE_LIMIT) {
                        hc.invalidate(-1)
                    } else {
                        hc.invalidate(entry.target._item)
                    }
                }

            }
            if (updated) refresh(id + 1)
        })

        useEffect(() => {
            return () => {
                state.observer.disconnect()
            }
        }, [])
        return <Holder onScroll={scroll} ref={componentHeight}
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

                    }}>
            <div ref={endRef} style={{marginTop: offset, height: 1}}/>
            <div style={{position: 'absolute', overflow: 'visible', height: 0, width: '100%', top: 0}}>
                <Items end={endRef} from={scrollPos} scrollInfo={scrollInfo.current} scroller={componentHeight}/>
            </div>
        </Holder>

        function animate(control) {
            function inner() {
                control.beat++
                if (scrollToItem && count++ < 8) {
                    let pos = getPositionOf(scrollToItem)
                    state.scroller.scrollTop = pos
                } else {
                    scrollToItem = undefined
                }
                if ((control.beat % 8 === 0) && state.scroller) {
                    let scrollTop = state.scroller.scrollTop
                    if (scrollTop !== scrollPos) setScrollPos(scrollTop)
                }
                if (control.running) requestAnimationFrame(inner)
            }

            return inner
        }


        function scroll(event) {
            setScrollPos(event.target.scrollTop)
        }

    }

    function componentHeight(target) {
        if (target) {
            target.scrollTop = scrollTop
            state.scroller = target
            let height = target.offsetHeight
            state.componentHeight = height
            setHeight(height)
        }
    }

    function render(item) {
        const cache = state.cache
        if (cache.has(item)) return cache.get(item)
        const toRender = items[item]
        let result = (!!toRender || items.useIndex) && <div ref={observe} key={item}>
            {renderItem(!items.useIndex ? toRender : item, height(item), item)}
        </div>
        cache.set(item, result)
        return result

        function observe(target) {
            if (target) {
                target._item = item
                state.observer.observe(target)
            }
        }
    }

    function height(item) {
        return function (calc) {
            if (calc === true) {
                delete state.heights[item]
            } else {
                state.heights[item] = calc
            }
            hc.invalidate(item)
        }
    }


    function Items({from, scrollInfo}) {
        status.from = from
        let item = Math.max(0, getItemFromPosition(from - Math.min(state.itemHeight * 10, state.componentHeight * overscan)))
        const updatedPosition = getPositionOf(status.item)
        const diff = updatedPosition - status.y
        if (diff) {
            state.scroller.scrollTop += diff
            status.y = updatedPosition
            from += diff
        }

        if (status.item !== item) {
            status.item = item
            state.render++
            let y = status.y = getPositionOf(item)

            const renders = status.renders
            const others = status.others

            others.length = 0
            renders.length = 0
            for (let i = Math.max(0, (item - (3 * overscan | 0))); i < item; i++) {
                others.push(render(i))
            }
            y -= from
            let scan = item
            let maxY = state.componentHeight * (overscan + .5) + (state.render < 2 ? 2 : 0)
            while (y < maxY && scan < items.length) {
                renders.push(render(scan))
                y += getHeightOf(scan)
                scan++
            }
            if (scan >= scrollInfo.lastItem) {
                scrollInfo.lastItem = scan
                scrollInfo.lastPos = y + from
            }
            status.scan = scan
        }

        scrollEventParams.items = items
        scrollEventParams.scrollTop = from
        scrollEventParams.start = item
        scrollEventParams.last = status.scan
        scrollEventParams.max = scrollInfo.lastItem
        onScroll(scrollEventParams)

        return <>
            <Wrapper style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 0,
                overflow: 'hidden'
            }}>
                {status.others}
            </Wrapper>
            <Wrapper style={{transform: `translateY(${status.y}px)`}}>
                {status.renders}
            </Wrapper>
        </>
    }

    function getPositionOf(item) {
        if (item < 0 || item > items.length - 1) return 0
        if (state.measured < MEASURE_LIMIT) {
            return state.itemHeight * item
        }
        return hc && hc(item)
    }


    function getItemFromPosition(from) {
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


}

Virtual.propTypes = {
    Wrapper: PropTypes.func,
    display: PropTypes.any,
    expectedHeight: PropTypes.number,
    flexGrow: PropTypes.any,
    height: PropTypes.any,
    items: PropTypes.array.isRequired,
    maxHeight: PropTypes.any,
    minHeight: PropTypes.any,
    onScroll: PropTypes.func,
    overscan: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollTop: PropTypes.number,
    useAnimation: PropTypes.bool,
    width: PropTypes.any
}
