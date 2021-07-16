import React from 'react'
import css from './css/tile.module.css'

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
            <div key={`e-${id}`} id={name} className={`${css.evidenceBody} text-dark`} onClick={() => this.props.setIdentity(this.props.selectIndex)}>
                <img key={`i-${id}`}className={css.tileImg} src={image} alt='image'/>
                {name}
            </div>
        )
    }
}