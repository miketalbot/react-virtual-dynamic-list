export function heightCalculator ( getHeight ) {
    const cache = new Map()

    function calcHeight ( v, level = 0 ) {
        if (v === 0) return 0
        let t = 0
        if ((v & 1) !== 0) {
            t += blockHeight( v - 1, level )
        }
        return t + calcHeight( v >> 1, level + 1 )
    }

    calcHeight.invalidate = function( item, level = 0 ) {
        if (item === -1) {
            cache.clear()
            return
        }
        cache.delete( `${item}:${level}` )
        if (item === 0) return
        calcHeight.invalidate( item >> 1, level + 1 )
    }

    function blockHeight ( block, level ) {
        if (level === 0) {
            return getHeight( block )
        } else if (level < 2) {
            return blockHeight( block << 1, level - 1 ) + blockHeight( (block << 1) + 1, level - 1 )
        } else {
            const key = `${block}:${level}`
            const existing = cache.get( key )
            if (existing !== undefined) {
                return existing
            }
            let result = blockHeight( block << 1, level - 1 ) + blockHeight( (block << 1) + 1, level - 1 )
            cache.set( key, result )
            return result
        }
    }

    return calcHeight
}
