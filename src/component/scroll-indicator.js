import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useMeasurement } from './use-measurement'

export function useInterval(fn, interval) {
    useEffect(() => {
        let id = setInterval(fn, interval)
        return () => {
            clearInterval(id)
        }
    })
}

const panelOpts = {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    right: 0,
    width: '100%',
    height: 0,
}
export const ScrollIndicatorHolder = React.forwardRef(
    function ScrollIndicatorHolder(
        {
            children,
            className,
            state,
            onScroll,
            style,
            shadow = '0 0 12px 2px',
            ...props
        },
        ref
    ) {
        const [size, attach] = useMeasurement()
        const [topAmount, setTopAmount] = useState(state.fadeTop || 0)
        const [bottomAmount, setBottomAmount] = useState(state.fadeBottom || 0)
        useEffect(() => {
            if (size.height > 0.1 && state.scroller) {
                setBottomAmount(
                    !state.scroller.scrollHeight ? 0 :
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (state.scroller.scrollHeight -
                                state.scroller.scrollTop -
                                size.height) /
                                64
                        )
                    )
                )
            }
        })
        useInterval(() => {
            if (size.height > 0.1 && state.scroller) {
                setBottomAmount(
                    !state.scroller.scrollHeight ? 0 :
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (state.scroller.scrollHeight -
                                state.scroller.scrollTop -
                                size.height) /
                                64
                        )
                    )
                )
            }
        }, 750)
        return (
            <div
                className={`${className} dynamic-list-holder`}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                }}
                ref={attach}
            >
                <div
                    style={{
                        boxShadow: shadow,
                        ...panelOpts,
                        top: 0,
                        opacity: topAmount,
                    }}
                />
                <div
                    style={{
                        boxShadow: shadow,
                        ...panelOpts,
                        bottom: 0,
                        opacity: bottomAmount,
                    }}
                />
                <div
                    ref={ref}
                    style={{ ...props, ...style, scrollTop: state.scroll }}
                    onScroll={scroll}
                >
                    {children}
                </div>
            </div>
        )

        function scroll(event) {
            const pos = event.target.scrollTop
            state.fadeTop = Math.min(1, pos / 64)
            state.fadeBottom = Math.max(
                0,
                Math.min(
                    1,
                    (event.target.scrollHeight - pos - size.height) / 64
                )
            )
            setTopAmount(state.fadeTop)
            setBottomAmount(state.fadeBottom)
            onScroll(event)
        }
    }
)
