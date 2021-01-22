import React from 'react'
import css from './tile.module.css'

export default class Tile extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        let image = (this.props.alibied ? this.props.alibiedImage : this.props.image)
        const name = this.props.name
        const isPlayer = (this.props.isPlayer ? css.markPlayer : '')
        const canClick = this.props.killSuspect !== undefined ? () => this.props.killSuspect(id) : undefined
        let killed = null
        if (!alive) {
            killed = <img key={`oId-${id}`} className={`${css.overlay}`} src={`/images/deadOverlay.png`} alt={name} />
        }
        return (
        <div key={`tileId-${id}`} id={name} className={`${css.tileBody} ${isPlayer}`} onClick={canClick}>
            <img key={`imgId-${id}`} className={css.tileImg} src={image} alt={name}/>
            {killed}
            {name}
        </div>
        )
    }
}