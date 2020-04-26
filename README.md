# React Virtual Dynamic List

Yes, yet another React Virtual List... Why?

* Provides dynamic item heights
* Has no dependencies (except React)
* Does not need to measure intermediate items when large scrolling, massively improving performance
* Does not need an accurate estimated item height
* Allows items to be resized after measurement (by flagging the need to re-measure)
* Allows natural browser layout of the components on screen within their standard container, no individual item positioning
* Works in environments that don't constantly fire scroll events (e.g. iOS)

This component uses a O(Ln2) algorithm to work out the position of items and caches all of this for maximum performance even when scrolling huge distances.

Supports list of up to 1,000,000 pixels in height (due to browser limitations on pixel heights).  Provides events that enable any number of items.

## Installation

`npm i react-virtual-dynamic-list`

## Usage

````jsx
    <Virtual items={someCollection} renderItem={item=>(<div>{item.id}</div>)}/>
````

or

````jsx
    <Virtual items={100000} renderItem={item=>(<div>Item number {item + 1}</div>)}/>
````


### Parameters

#### `items` - array | number of items

Provides the items that will be rendered, if an array is used, the contents are passed to the renderItem function
as context, otherwise the index is passed

#### `renderItem` - function (item|index, invalidateHeight(), index) 

A function to render the item.  The first parameter is the item or the item's index.  The second is
a function to call if the height of the item changes, the third is always the index.

#### `scrollTop` - the scroll position of the component in  pixels (default to 0)

#### `scrollToItem` - scroll to show the specified index at the top of the display

#### `Wrapper` - the wrapper for items in the grid (defaults to \<div/>)

If you need your items to render properly inside a wrapper component then you can provide it here.

Your component must apply the `style` prop passed to it and render `children`

#### `Holder` - the overall holder for the grid (defaults to \<div/>)

If you need your items to render properly inside a wrapper component then you can provide it here.

Your component must apply the `style` prop passed to it, take a forwardRef and apply it to the root and render `children`


#### `useAnimation` - should animation be used to help position items e.g. for iOS (defaults to true)

Animation is used in addition to scrolling.  A very minor overhead.

#### `overscan` - the number of component heights to apply as overscan (defaults to 1)

Provides a number of pages of overscan

#### `expectedHeight` - the expected height, can be very rough (defaults to 64)

Heights are worked out from averages after the first render, so something rough is fine.

#### `onScroll` - function({items, start, last, scrollPos, max})

Provides an event that can modify the scroll.  You may change items in this function.

##### `items` - the items being rendererd
##### `start` - the first item being rendered (off screen above)
##### `last` - the last item being rendererd (off screen below)
##### `max` - the last item that has been rendered ever (useful for loading more)

````javascript 1.8
    function onScroll({max, items}) {
        if (max > items.length - 15) {
            items.push(...Array.from({length: 15}, (_, index) => ({
                id: index + items.length,
                height: Math.random() * 98 + 32 | 0,
                color: rgb(Math.random() * 112 + 143,
                    Math.random() * 112 + 143, Math.random() * 112 + 143)
            })))
        }
    }
````

### OTHER PROPERTIES

Are passed to the wrapping div that does the scrolling (this is not Wrapper, that holds the actual items).

````jsx
    <Virtual items={1000} renderItem={i=>(<div>{i}</div>)} width={80} height={200}/>
````

Sets the size of the rendered div to 80 x 200

