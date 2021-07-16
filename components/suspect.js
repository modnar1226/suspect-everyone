import React from 'react'
import css from './css/tile.module.css'

export default class Suspect extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        return (
            <div key={`e-${id}`} id={name} className={css.evidenceBody} onClick={() => this.props.makeArrest(id)}>
                <img key={`i-${id}`}className={css.tileImg} src={image} alt='image'/>
                {name}
            </div>
        )
    }
}