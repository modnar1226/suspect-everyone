import React from 'react'
import css from './css/tile.module.css'

export default function SecretIdentity (props) {
    //let killed = null;
    //if (!alive) {
    //    killed = <img key={`oId-${props.id}`} className={css.overlay} src={`/images/deadOverlay.png`} alt={props.name} />
    //}
    return (
       <div>
           {props.id}
       </div>
    )
}