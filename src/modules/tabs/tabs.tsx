import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const {
    children, value, index, ...other
  } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2.5}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  appBar: {
    position: 'relative',
    color: theme.palette.primary.dark,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  appBarLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: '#C6C2DE',
    zIndex: -1,
  },
  tabsInfo: {
    margin: 'auto 0 auto auto',
    fontSize: '14px',
    lineHeight: '17px',
  },
  tabsInfo_value: {
    color: '#6D5BD0',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '21.78px',
  },
  tabsInfo_currency: {
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '21.78px',
  },
  tabItem: {
    minWidth: 'auto',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    textTransform: 'none',
  },
}))

export default function SimpleTabs() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="All" {...a11yProps(0)} className={classes.tabItem} />
          <Tab label="Shipped" {...a11yProps(1)} className={classes.tabItem} />
          <Typography
            className={classes.tabsInfo}
            variant="body1"
            component="p"
          >
            Total orders: <span className={classes.tabsInfo_value}>$900.00</span> <span className={classes.tabsInfo_currency}>USD</span>
          </Typography>
        </Tabs>
        <div className={classes.appBarLine} />
      </AppBar>
      <TabPanel value={value} index={0} />
      <TabPanel value={value} index={1} />
    </div>
  )
}
