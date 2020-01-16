import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Output from "../Content/Outputs"
import Input from "../Content/Inputs";
import {Switch, Route} from 'react-router-dom'
import DependencyGraph from "../Sidebar/DependencyGraph"
import SideBar from "../Content/SideBar";


export default function Content(props) {

    // Defining Hooks
    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            width: '100%',
            background: '#FEFEFD'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        menuBar: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '6px',
        }
    }))
    const classes = useStyles()


    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <SideBar className={classes.sidebar} outputs={props.outputs}/>
                <Switch>
                    <Route exact path={["/", "/dashboard"]}>
                        <Output
                            type="summary"
                            {...props}

                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/distributions">
                        <Output
                            type="distributions"
                            {...props}
                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/inputimportance">
                        <Output
                            type="inputimportance"
                            {...props}
                        />
                    </Route>
                    <Route exact path="/sensitivity">
                        <Output
                            type="sensitivity"
                            {...props}
                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/scenario">
                        <Output
                            type="scenarioanalysis"
                            {...props}
                        />
                    </Route>
                    <Route exact path="/dependency">
                        <DependencyGraph/>
                    </Route>
                    <Route exact path="/home">
                        <div>This is home</div>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}


