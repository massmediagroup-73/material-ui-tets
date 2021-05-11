import React from 'react'
import { Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import EnhancedTable from 'modules/table/components/table/table'
import Tabs from 'modules/tabs/tabs'
import Title from 'modules/title/title'

const useStyles = makeStyles((theme: Theme) => createStyles({
  logoWrapper: {
    marginTop: theme.spacing(6.25),
    marginBottom: theme.spacing(2.5),
  },
}))

const Home = () => {
  const classes = useStyles()
  return (
    <Container>
      <div className={classes.logoWrapper}>
        <Title>
          Orders
        </Title>
      </div>
      <Tabs />
      <EnhancedTable />
    </Container>
  )
}

export default Home
