import React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function CardSettings() {
    const useStyles = makeStyles(theme => ({
        root: {},
        settings: {
            display: "flex",
            color: '#5C6671'
        },
        settingsMenu: {
            display: "flex",
            backgroundColor: '#45515D',
            color: 'white',

        },
        settingsList: {
        },
        menuItem: {
            fontFamily:'Quicksand',
            fontSize: '0.9em'
        },
    }))
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton className={classes.settings} aria-controls="simple-menu" aria-haspopup="true"
                        onClick={handleClick} size={"small"}>
                <EditIcon/>
            </IconButton>
            <Menu
                classes={{paper: classes.settingsMenu, list:classes.settingsList}}
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableScrollLock={true}
            >
                <MenuItem className={classes.menuItem} onClick={handleClose} dense={true}>Hide</MenuItem>
                <MenuItem className={classes.menuItem} onClick={handleClose} dense={true}>Edit Chart</MenuItem>
                <MenuItem className={classes.menuItem} onClick={handleClose} dense={true}>Remove Output</MenuItem>
            </Menu>
        </div>
    );
}