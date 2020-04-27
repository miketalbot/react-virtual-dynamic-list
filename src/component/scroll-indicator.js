import React, { useLayoutEffect, useState } from 'react'
import { useMeasurement } from './use-measurement'

const panelOpts = {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    right: 0,
    width: '100%',
    height: 0,
}
export const ScrollIndicatorHolder = React.forwardRef( function ScrollIndicatorHolder (
    { children, className, state, onScroll, style, shadow = '0 0 12px 2px', ...props },
    ref
) {
    const [size, attach] = useMeasurement()
    const [topAmount, setTopAmount] = useState( state.fadeTop || 0 )
    const [bottomAmount, setBottomAmount] = useState( state.fadeBottom || 0 )
    useLayoutEffect( () => {
        if (size.height > 0.1 && state.scroller) {
            setBottomAmount(
                Math.max( 0, Math.min( 1, (state.scroller.scrollHeight - state.scroller.scrollTop - size.height) / 64 ) )
            )
        }
    }, [size.height, state.scroller] )
    return (
        <div
            className={className}
            style={{
                position: 'relative',
                overflow: 'hidden'
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
            <div ref={ref} style={{ ...props, ...style, scrollTop: state.scroll }} onScroll={scroll}>
                {children}
            </div>
        </div>
    )

    function scroll ( event ) {
        const pos = event.target.scrollTop
        state.fadeTop = Math.min( 1, pos / 64 )
        state.fadeBottom = Math.max( 0, Math.min( 1, (event.target.scrollHeight - pos - size.height) / 64 ) )
        setTopAmount( state.fadeTop )
        setBottomAmount( state.fadeBottom )
        onScroll( event )
    }
} )
