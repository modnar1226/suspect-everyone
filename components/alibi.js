import React from 'react'
import css from './css/tile.module.css'

export default class Alibi extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        const susId = this.props.susId
        const alibiIndex = this.props.alibiIndex

        let killed = null
        if (!alive) {
            killed = <img key={`oId-${id}`} className={css.overlay} src={`/images/deadOverlay.png`} alt={name} />
        }
        return (
            <div key={`e-${id}`} id={name} className={css.alibiBody} onClick={() => this.props.alibiSuspect(alibiIndex,susId)}>
                <img key={`i-${id}`}className={css.tileImg} src={image} alt='image'/>
                {killed}
                {name}
            </div>
        )
    }
}