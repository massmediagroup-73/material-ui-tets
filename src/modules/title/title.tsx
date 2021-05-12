import { PropsWithChildren } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    fontWeight: 'bold',
    fontSize: theme.spacing(1.75),
    lineHeight: '17px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
  },
}))

const Title = ({ children }: PropsWithChildren<{}>) => {
  const classes = useStyles()
  return (
    <Typography className={classes.root} variant="h1">
      {children}
    </Typography>
  )
}

export default Title
