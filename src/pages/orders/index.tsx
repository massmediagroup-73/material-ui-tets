import React from 'react'
import { Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Logo } from 'modules/logo'
import EnhancedTable from 'modules/table/components/table/table'

const useStyles = makeStyles((theme: Theme) => createStyles({
  logoWrapper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

const Home = () => {
  const classes = useStyles()
  return (
    <Container>
      <div className={classes.logoWrapper}>
        <Logo isHrCentered />
      </div>
      <EnhancedTable />
    </Container>
  )
}

export default Home
