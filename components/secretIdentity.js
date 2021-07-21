import React from 'react'
import css from './css/tile.module.css'

export default class SecretIdentity extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        let image = (this.props.alibied ? this.props.alibiedImage : this.props.image)
        const name = this.props.name
        let killed = null
        if (!alive) {
            killed = <img key={`oId-${id}`} className={css.overlay} src={`/images/deadOverlay.png`} alt={name} />
        }
        return (
        <div key={`tileId-${id}`} id={name} className={css.tileBody}>
            <img key={`imgId-${id}`} className={css.tileImg} src={image} alt={name}/>
            {killed}
            {name}
        </div>
        )
    }
}