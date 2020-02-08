import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import {Card} from "@material-ui/core";
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp'
import {Link} from 'react-router-dom'
import {deleteRecord, getRecords, uploadFile} from "./api";
import Spinner from "../UtilityComponents/Spinner";
import IconButton from '@material-ui/core/IconButton'
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp'
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Dropzone from "react-dropzone";
import TextField from "@material-ui/core/TextField";

// import Button from "@material-ui/core/Button";
// import {Switch, Route} from 'react-router-dom'
// import Spreadsheet from "./Spreadsheet";


export default function Home(props) {

    // Defining Hooks
    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '10px',
            background: '#FEFEFD'
        },
        existingContainer: {
            display: 'flex',
            minWidth: '180px',
            flexDirection: 'column',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            background: 'linear-gradient(#F4F4F4 10%,#FEFEFD)',
            padding: '5px',
            margin: '10px'
        },
        existingdash: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '4px',
            padding: '5px',
            background: '#627C8D',
            width: '100%',
            height: '30px',
            cursor: 'pointer',
            "&:hover": {
                background: '#A5014B',
            }
        },
        newdashboardpaper: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '0px',
            marginBottom: '5px',
            padding: '5px',
            background: '#006491',
            width: '180px',
            cursor: 'pointer'
        },
        dashTitle: {
            fontFamily: 'Questrial',
            fontSize: '0.9em',
            fontWeight: '200',
            color: '#FEFEFD',
            marginTop: '0px',
            marginBottom: '0px'
        },
        selectButton: {
            display: 'flex',
            background: '#006E9F',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#FEFEFD',
            padding: '5px',
            margin: '5px'
        },
        buttonText: {
            fontSize: '0.85em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            margin: '0px'
        },
        saveField: {
            fontSize: '0.85em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            margin: '0px'
        },
        labelField: {
            fontSize: '0.95em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            margin: '0px'
        },
        labelFocused: {
            fontSize: '1.1em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            margin: '0px'
        },
    }))
    const classes = useStyles()
    const [records, setRecords] = useState([])
    const [askDelete, setAskDelete] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [askNewDash, setAskNewDash] = useState(false)
    const [newFile, setNewFile] = useState(null)
    const [newDashname, setNewDashname] = useState('')
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {
        const executeGetUserRecords = async () => {
            const userRecords = await getRecords()
            setRecords([...userRecords])
        }
        executeGetUserRecords()

    }, [])

    const openDash = (dash_id) => {
        props.clearState()
        props.setDashid(dash_id)
        props.updateMode('processed')
        props.setDashName('')
        props.updateMsg("Opening Dashboard...")
        props.updateOpen(true)
    }

    const createMyDashboards = () => {
        if (records.length >= 1) {
            let myDashboards = records.map(record => {
                return (
                    <div key={record.id}
                         style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Paper className={classes.existingdash}
                               component={Link} to="/dashboard"
                               style={{textDecoration: 'none'}}
                               onClick={() => openDash(record.id)}>
                            <h1 className={classes.dashTitle}>{record.name}</h1>
                        </Paper>
                        <IconButton onClick={() => askDeleteHandler(record.id)}>
                            <DeleteSharpIcon size="small" style={{
                                color: '#8BBDD3'
                            }}/>
                        </IconButton>
                    </div>
                )
            })

            return (
                <Card className={classes.existingContainer}>
                    <h1 className={classes.dashTitle} style={{
                        fontFamily: 'Questrial',
                        fontSize: '1.2em',
                        fontWeight: '200',
                        color: '#006E9F',
                        marginBottom: '5px'
                    }}>My Dashboards</h1>
                    {myDashboards}
                </Card>
            )
        } else {
            return <Spinner/>

        }
    }

    const askDeleteHandler = (dash_id) => {
        setAskDelete(true)
        setToDelete(dash_id)
    }

    const deleteDashBoard = async (dash_id) => {
        let newRecords = records.filter(record => record.id !== toDelete)
        const response = await deleteRecord(dash_id)
        if (response === 'OK') {
            setToDelete(null)
            setRecords([...newRecords])
        }
    }

    const confirmDeleteHandler = (update) => {
        if (update === true) {
            deleteDashBoard(toDelete)
            setAskDelete(false)
        } else {
            setToDelete(null)
            setAskDelete(false)
        }
    }

    const newDashboardHandler = async () => {
        if (newDashname === '') {
            props.updateMsg("Please provide a name for this dashboard")
            props.updateOpen(true)
        } else if (!newFile) {
            props.updateMsg("Please upload a file")
            props.updateOpen(true)
        } else {
            const response = await uploadFile(newFile, newDashname)
            props.clearState()
            props.setDashid(response.dash_id)
            props.setDashName(newDashname)
            props.updateMode("new")
            if (response.message === 'OK') {
                setLoaded(true)
            }
        }
    }

    const newDashSetup = () => {
        if (askNewDash && !loaded) {
            return (
                <Dialog
                    open={askNewDash}
                    PaperProps={{
                        style:
                            {
                                display: 'flex',
                                width: '300px',
                                height: '200px',
                                padding: '10px',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly'
                            },
                    }}>
                    <TextField
                        required
                        className={classes.saveField}
                        InputLabelProps={{
                            classes: {
                                root: classes.labelField,
                                focused: classes.labelFocused
                            }
                        }}
                        InputProps={{
                            classes: {
                                input: classes.saveField
                            }
                        }}
                        inputProps={{
                            maxLength: 15
                        }}
                        label="Dashboard Name"
                        defaultValue=""
                        size="small"
                        onBlur={(e) => setNewDashname(e.target.value)}
                    />
                    <Dropzone
                        onDrop={(file) => setNewFile(file)}
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    >
                        {({getRootProps, getInputProps}) => (
                            <Button {...getRootProps()}
                                    className={classes.selectButton}
                                    style={{backgroundColor: '#006E9F'}}
                                    size="small"
                            >
                                <input {...getInputProps()} />
                                <h3 className={classes.buttonText}>Upload Excel Model</h3>
                            </Button>
                        )}
                    </Dropzone>
                    <h3 className={classes.buttonText}><em>Only *.xlsx or *.xls files are supported currently</em></h3>
                    <div style={{
                        display: 'flex',
                        marginTop: '10%',
                        width: '100%',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <Button
                            className={classes.selectButton}
                            size="small"
                            onClick={() => newDashboardHandler()}
                        >
                            <h3 className={classes.buttonText}>OK</h3>
                        </Button>
                        <Button className={classes.selectButton} style={{backgroundColor: '#9DA0A3'}} size="small"
                                onClick={() => setAskNewDash(false)}>
                            <h3 className={classes.buttonText}>Cancel</h3>
                        </Button>
                    </div>
                </Dialog>
            )
        } else if (askNewDash && loaded) {
            return (
                <Dialog
                    open={askNewDash}
                    PaperProps={{
                        style:
                            {
                                display: 'flex',
                                width: '300px',
                                height: '200px',
                                padding: '10px',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly'
                            },
                    }}>
                    <Button
                        className={classes.selectButton}
                        size="small"
                        component={Link}
                        to="/spreadsheet"
                    >
                        <h3 className={classes.buttonText}>Go to Input and Output Selection</h3>
                    </Button>
                </Dialog>
            )
        }
    }


    let myDashboards = createMyDashboards()
    let newDashEl = newDashSetup()

    return (
        <div className={classes.root}>
            <Paper
                className={classes.newdashboardpaper}
                onClick={() => setAskNewDash(true)}
            >
                <AddCircleSharpIcon style={{color: '#FEFEFD'}}/>
                <h1 className={classes.dashTitle}>Create New
                    Dashboard</h1>
            </Paper>
            {myDashboards}
            <Dialog open={askDelete}>
                <div>
                    <h2 style={{
                        fontSize: '0.9em',
                        fontWeight: '100',
                        paddingLeft: '5px',
                        fontFamily: 'Questrial',
                        color: '#292F36',
                        margin: '10px'
                    }}>Delete this dashboard?</h2>
                </div>
                <Button className={classes.selectButton} size="small"
                        onClick={() => confirmDeleteHandler(true)}>
                    <h3 className={classes.buttonText}>Yes</h3>
                </Button>
                <Button className={classes.selectButton} size="small"
                        onClick={() => confirmDeleteHandler(false)}>
                    <h3 className={classes.buttonText}>No</h3>
                </Button>
            </Dialog>
            {newDashEl}
        </div>
    )
}


