import React, {useState, useEffect} from 'react'
import OutputSelector from "./OutputSelector";
import InputSelector from "./InputSelector";
import {Redirect} from "react-router-dom"

export default function IOController(props) {
    const [IO, setIO] = useState("inputs")
    const [stage, setStage] = useState("empty")


    const updateStage = (update) => {
        setStage(update)
    }

    const updateIO = (update) => {
        if (update === 'outputs' && props.outputs.length > 0) {
            setStage("summary")
        } else {
            console.log(props.sheets[0])
            props.handleSheetChange(props.sheets[0])
            setStage("empty")
        }
        setIO(update)
    }

    useEffect(() => {
        if (props.outputs.length > 0 && props.inputs.length > 0) {
            setStage("summary")
        }

    }, [props.outputs, props.inputs])

    useEffect(() => {
        if (IO === 'calculate') {

            //First create formats array
            let inputFormats = props.inputs.reduce((acc, input) => {
                    let ifmt = input.format
                    acc = {...acc, [input.address]: ifmt}
                    return acc
                }
                , {})
            let outputFormats = props.outputs.reduce((acc, output) => {
                    let fmt = output.formats
                    acc = {...acc, ...fmt}
                    return acc
                }
                , {})

            props.updateFormats({...inputFormats, ...outputFormats})

            //Next create default case
            const defaultCase = props.inputs.reduce((acc, input) => {
                acc[input.address] = input.value
                return acc
            }, {})

            props.updateCases({
                ...props.cases,
                'Default': defaultCase
            })

            //Finally update global mode to calculate
            props.updateMode("calculate")
        }
    }, [props, IO])


    if (IO === 'outputs') {
        return (
            <OutputSelector
                {...props}
                stage={stage}
                IO={IO}
                updateStage={updateStage}
                updateIO={updateIO}
            />
        )
    } else if (IO === 'inputs') {
        return (
            <InputSelector
                {...props}
                stage={stage}
                IO={IO}
                updateStage={updateStage}
                updateIO={updateIO}
            />
        )
    } else {
        return (<Redirect to='/dashboard'/>)
    }
}
