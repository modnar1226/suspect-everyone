import { Component } from "react"
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const iconList = Object
    .keys(Icons)
    .filter(key => key !== "fas" && key !== "prefix")
    .map(icon => Icons[icon])

library.add(...iconList)


import '../styles/global.css'

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}