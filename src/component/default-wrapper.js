import React from 'react'

export const DefaultWrapper = React.forwardRef( function DefaultWrapper ( { style, className, onScroll, children }, ref ) {
    return (
        <div ref={ref} style={style} onScroll={onScroll} className={className}>
            {children}
        </div>
    )
} )
