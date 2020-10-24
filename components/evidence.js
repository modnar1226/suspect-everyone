import React from 'react'
import css from './tile.module.css'

export default class Evidence extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const id = this.props.id
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        return (
            <div key={id} id={name} className={css.evidenceBody} onClick={() => this.props.setIdentity(this.props.index)}>
            <img className={css.tileImg} src={image} alt='image'/>
            {name}
        </div>
        )
    }
}