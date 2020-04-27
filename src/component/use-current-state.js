import { useLayoutEffect, useRef, useState } from 'react'

export function useCurrentState ( ...params ) {
    const [value, setValue] = useState( ...params )
    let currentSetV = useRef()
    currentSetV.current = setValue
    useLayoutEffect( () => {
        return () => (currentSetV.current = null)
    }, [] )
    return [
        value,
        function( ...params ) {
            currentSetV.current && currentSetV.current( ...params )
        },
    ]
}
