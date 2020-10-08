import React from 'react'
import css from './tile.module.css'

export default class Tile extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const key = this.key
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        return (
        <div key={key} id={name} className={css.tileBody}>
            {image}
            {name}
        </div>
        )
    }
}