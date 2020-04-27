import { useEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export function useMeasurement ( ref ) {
    const [size, setSize] = useState( { width: 0.0001, height: 0.0001 } )
    const [observer] = useState( () => new ResizeObserver( measure ) )
    useEffect( () => {
        return () => {
            observer.disconnect()
        }
    }, [] )
    return [size, attach]

    function attach ( target ) {
        ref && ref( target )
        if (target) {
            observer.observe( target )
        }
    }

    function measure ( entries ) {
        setSize( { ...JSON.parse( JSON.stringify( entries[0].contentRect ) ), element: entries[0].target } )
    }
}
