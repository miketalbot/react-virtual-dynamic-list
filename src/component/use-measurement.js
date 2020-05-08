import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import debounce from 'lodash/debounce'
import ReactDOM from 'react-dom'

export function useClearableState(initialValue, setter) {
    let [value, setValue] = useState(initialValue)
    useEffect(() => {
        return () => {
            setValue = null
        }
    }, [])
    const update = (v) => setValue && setValue(v)
    setter && setter(update)
    return [value, update]
}

let batches = []

function batch(fn) {
    batches.push(fn)
    runBatches()
}

const runBatches = debounce(
    function() {
        ReactDOM.unstable_batchedUpdates(()=>{
            let toRun = batches
            batches = []
            for (let fn of toRun) {
                try {
                    fn()
                } catch(e) {

                }
            }
        })

    },
    48,
    { maxWait: 200 }
)

export function useMeasurement(ref) {
    const element = useRef()
    const [size, setSize] = useState({
        width: 0.0000001,
        height: 0.0000001,
    })
    const sizeFn = useRef(setSize)
    sizeFn.current = setSize

    const [observer] = useState(() => new ResizeObserver(measure))
    useLayoutEffect(() => {
        return () => {
            sizeFn.current = null
            observer.disconnect()
        }
    }, [observer])
    return [size, attach]

    function sized(...params) {
        batch(()=>{
            sizeFn.current && sizeFn.current(...params)
        })
    }

    function attach(target) {
        element.current = target
        ref && ref(target)
        if (target) {
            observer.observe(target)
        }
    }

    function measure(entries) {
        let contentRect = entries[0].contentRect
        if (contentRect.height > 0) {
            sized({
                height: contentRect.height,
                width: contentRect.width,
                left: contentRect.left,
                top: contentRect.top,
                element: entries[0].target,
            })
        }
    }
}
