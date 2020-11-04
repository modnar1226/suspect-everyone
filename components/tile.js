import React from 'react'
import css from './tile.module.css'

export default class Tile extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        return (
        <div key={`tileId-${id}`} id={name} className={css.tileBody}>
                <img key={`imgId-${id}`} className={css.tileImg} src={image} alt={name}/>
            {name}
        </div>
        )
    }
}