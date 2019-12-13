import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'


const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            padding: '20px',
        },
        label: {
            display: 'flex',
            fontWeight: 'bold',
            fontSize: '1.0em',
            fontFamily: 'Roboto',
            marginTop: '0%',
            marginBottom: '5%'
        },
        slider: {
            color: '#0091ea'
        },
        mark: {
            backgroundColor: '#0091ea',
            height: 8,
            width: 1,
            marginTop: -3
        }
    }
))


function valuetext(value) {
    return `${value}%`
}

function valueLabelFormat(value) {
    return `${value * 100}%`
}

function generateMarks(values) {
    return values.map(v => (
            {value: v,
            label: (v*100).toString()+'%'}
        )
    )
}


export default function InputSlider(props) {
    const classes = useStyles()

    const marks = generateMarks(props.values)
    const min = Math.min(...props.values)
    const max = Math.max(...props.values)

    return (
        <div className={classes.root}>
            <Slider classes={{root: classes.slider, mark: classes.mark}}
                    defaultValue={props.defaultInputVal}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-restrict"
                    valueLabelDisplay="on"
                    valueLabelFormat={valueLabelFormat}
                    min={min}
                    max={max}
                    step={null}
                    marks={marks}
                    onChange={(event, value) => props.onChange(event, value, props.address)}
            />
            <div className={classes.label}>
                {props.name}
            </div>
        </div>

    )
}


