import React from 'react'
import Logo from "../../components/logo/logo"
import EnhancedTable from "../../components/table/table"
import {Container} from "@material-ui/core"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoWrapper: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

const Home = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <div className={classes.logoWrapper}>
        <Logo isHrCentered />
      </div>
      <EnhancedTable />
    </Container>
  )
}

export default Home