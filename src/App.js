import React, {useState} from 'react'
import './App.css'
import {Box, Container, CssBaseline} from '@material-ui/core'
import {ScrollIndicatorHolder, Virtual} from './component'

function rgb(r, g, b) {
    const color = (r << 16) + (g << 8) + b
    const hex = `00000000000${color.toString(16)}`.slice(-6)
    return `#${hex}`
}

const defaultItems = Array.from({length: 150}, (_, index) => ({
    id: index,
    height: Math.random() * 98 + 32 | 0,
    color: rgb(Math.random() * 112 + 143,
        Math.random() * 112 + 143, Math.random() * 112 + 143)
}))
const defaultLongItems = Array.from({length: 15000}, (_, index) => ({
    id: index,
    height: Math.random() * 98 + 32 | 0,
    color: rgb(Math.random() * 112 + 143,
        Math.random() * 112 + 143, Math.random() * 112 + 143)
}))

function Item({item}) {
    const [height, setHeight] = useState(item.height)
    item.height = height
    return <Box onClick={()=>setHeight(height + 20)} height={height}
                bgcolor={item.color}>{item.id}</Box>
}

function App() {
    const [items, setItems] = useState(defaultItems)
    const [scrollTop, setScrollTop] = useState(0)
    return (
        <div className="App">
            <CssBaseline/>
            <Container>
                <Box display={'flex'} height={'100vh'} flexDirection={'column'} w={1}>
                    <Box>List 1 - increase length</Box>
                    <Box height={300}>
                        <Virtual scrollTop={scrollTop} onScroll={addItems} items={[...items]} renderItem={item => {
                            return <Item item={item}/>
                        }}/>
                    </Box>
                    <Box>List 2 - only height</Box>
                    <Box height={300}>
                        <Virtual shadow={'0 0 32px 14px black'} scrollTop={scrollTop} items={[...items]} Holder={ScrollIndicatorHolder} renderItem={item => {
                            return <Item item={item}/>
                        }}/>
                    </Box>
                    <Box>List 2 - big</Box>

                        <Virtual  flexGrow={1} scrollToItem={45} items={defaultLongItems} renderItem={item => {

                            return <Box onClick={() => console.log(item)} height={item.height}
                                        bgcolor={item.color}>{item.id}</Box>
                        }}/>



                </Box>
            </Container>
        </div>
    )

    function addItems({max, items}) {
        if (max > items.length - 15) {
            items.push(...Array.from({length: 15}, (_, index) => ({
                id: index + items.length,
                height: Math.random() * 98 + 32 | 0,
                color: rgb(Math.random() * 112 + 143,
                    Math.random() * 112 + 143, Math.random() * 112 + 143)
            })))
        }
    }
}

export default App
