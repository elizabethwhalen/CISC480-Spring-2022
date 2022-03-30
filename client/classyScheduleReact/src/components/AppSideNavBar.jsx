import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import Collapse from '@mui/material/Collapse'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import HelpIcon from '@material-ui/icons/Help'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import ClassIcon from '@material-ui/icons/Class'

const drawerWidth = 300 // width of the drawer

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: '#b71c1c',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 100,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  text: {
    color: '#424242',
  },
  link: {
    textDecoration: 'none',
  },
  collapseLink: {
    paddingLeft: '50px'
  }
}))

// MAIN COMPONENT CONTAINING THE SIDE NAV BAR
const AppSideNavBar = (props) => {

  const classes = useStyles() // call the useStyle hook
  const theme = useTheme() // call the useTheme
  const [openNestedList, setOpenNestedList] = React.useState(false); // variable used to indicate if the nested list is expanded
  const [selectedIndex, setSelectedIndex] = React.useState(1) // variable used to indicated which list item is selected

  // This function will set the item selected as "selected"
  // If selected, the list item will change its background color
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)

    /*
      When option 2 (functions) is selected,
      If the header & drawer are open, then the nested list can be expanded
      Otherwise, disable its expandable function
    */
    if (index === 2) {
      if (props.open) {
        setOpenNestedList(!openNestedList)
      } else {
        setOpenNestedList(false)
      }
      
    }
  }

  // This function will collapse the nested list when the side nav bar is closed
  const handleDrawerClose = () => {
    props.handleDrawerClose();
    setOpenNestedList(false)
  }

  // Return the Side Nav Bar component
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>

      <Divider />

      <List>

         {/* HOME */}
        <Link exact to="/" className={classes.link} >
          <ListItem
            button
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText className={classes.text}>Home</ListItemText>
          </ListItem>
        </Link>

        {/* FUNCTIONS */}
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText className={classes.text}>
            Functions
          </ListItemText>
          {openNestedList ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {/* NESTED LIST */}
        <Collapse in={openNestedList} timeout="auto" unmountOnExit>

          {/* Add course */}
          <List disablePadding>
            <Link exact to='/AddClass' className={classes.link} >
              <ListItem button className={classes.collapseLink}>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText className={classes.text}>
                  Add Course
                </ListItemText>
              </ListItem>
            </Link>

            {/* Add Faculty */}
            <Link exact to='/AddFaculty' className={classes.link} >
              <ListItem button className={classes.collapseLink}>
                <ListItemIcon>
                  <PermIdentityIcon />
                </ListItemIcon>
                <ListItemText className={classes.text}>
                  Add Faculty
                </ListItemText>
              </ListItem>
            </Link>
          </List>
        </Collapse>

        {/* CALENDAR */} 
        <Link exact to="/Calendar" className={classes.link} >
          <ListItem
            button
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3)}
          >
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText className={classes.text}>
              Calendar Overview
            </ListItemText>
          </ListItem>
        </Link>

        {/* HELP */}
        <Link exact to="/Help" className={classes.link} >
          <ListItem
            button
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 4)}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText className={classes.text}>
              Help
            </ListItemText>
          </ListItem>
        </Link>
      </List>
    </Drawer>
  )
}

// Export the component as default
export default AppSideNavBar