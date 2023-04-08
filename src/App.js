import React from "react"
import Header from "./components/Header"
import "./style.css"
import MemeGenerator from "./components/MemeGenerator"

export default function App() {
    return (
        <div>
            <Header />
            <MemeGenerator />
        </div>
    )
}