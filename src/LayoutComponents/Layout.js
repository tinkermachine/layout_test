import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Content from "./Content";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import Spinner from "./Spinner";
import {getSolutions, getMetaData, getFormats} from "../api/api"


const useStyles = makeStyles(theme => ({
    root: {},
    top: {
        display: 'flex',
        position: 'fixed',
        width: '100%',
        zIndex: '2'
    },
    middle: {
        display: 'flex',
        marginTop: '5vh'
    },
    bottom: {
        fontSize: '0.8em',
        fontFamily: 'Work Sans'
    },
    spinner: {
        display: 'flex'
    }
}));

function extractDefaults(values) {
    if (Object.keys(values)[0] === 'Default') {
        return values.Default
    }
}


export default function Layout() {

    // Defining hooks
    const classes = useStyles()
    const [solutions, setSolutions] = useState(null)
    const [domains, setDomains] = useState(null)
    const [formats, setFormats] = useState("0.0")
    const [currInputVal, setcurrInputVal] = useState(null)
    const [defaultInputVal, setdefaultInputVal] = useState(null)
    const [inputs, setInputs] = useState(null)
    const [outputs, setOutputs] = useState(null)
    const [cases, setCases] = useState(null)
    const [charts, setCharts] = useState(null)
    const [dashName, setDashName] = useState("Loading...")
    const [isLoaded, setisLoaded] = useState(false)
    let content

    // At initial load
    useEffect(() => {
        const runEffect = async () => {
            const metadata = await getMetaData()
            const _solutions = await getSolutions()
            const _formats = await getFormats()
            setSolutions(_solutions.solutions)
            setDomains(_solutions.domains)

            for (const _add in _formats) {
                _formats[_add] = _formats[_add].replace(/\\/g, "")
            }

            setFormats(_formats)
            setDashName(metadata.name)
            setCases(metadata.cases)
            setInputs(metadata.inputs)

            let defaults = metadata.cases.map(i => {
                return extractDefaults(i)
            })
            setdefaultInputVal(defaults[0])
            setcurrInputVal(defaults[0])
            setOutputs(metadata.outputs)
            setCharts(metadata.charts)

            setisLoaded(isLoaded => !isLoaded)
        }
        runEffect()
    }, [])

    // Defining functions
    const handleSliderChange = (event, newValue, setAddress) => {
        setcurrInputVal(prevState => ({
            ...prevState,
            [setAddress]: newValue
        }))
    }

    if (isLoaded) {
        content =
            <Content handleSliderChange={handleSliderChange}
                     solutions={solutions}
                     currInputVal={currInputVal}
                     domains={domains}
                     formats={formats}
                     inputs={inputs}
                     outputs={outputs}
                     defaultInputVal={defaultInputVal}
                     charts={charts}
            />


    } else {
        content = <Spinner className={classes.spinner}/>
    }


    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                <Grid className={classes.top} item xs={12} lg={12}>
                    <TopBar dashName={dashName}/>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <div className={classes.middle}>
                        <SideBar/>
                        {content}
                    </div>
                </Grid>
                {/*<Grid className={classes.bottom} item xs={12} lg={12}>*/}
                {/*    Copyright Information, Epoch One, LLC 2019*/}
                {/*</Grid>*/}
            </Grid>
        </div>
    );
}