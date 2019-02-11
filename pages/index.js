import React from 'react';
import { Grid, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@material-ui/core';
import { Link } from '../routes';
import web3 from '../libs/web3';
import Project from '../libs/project';
import ProjectList from '../libs/projectList';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
import InfoBlock from '../components/InfoBlock';

class Index extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     accounts: [],
  //   };
  // }

  static async getInitialProps({ req }) {
    // const projects = await ProjectList.methods.getProjects().call();
    // return { projects };
    const addressList = await ProjectList.methods.getProjects().call();
    console.log('address list...', { addressList });
    const summaryList = await Promise.all(
      addressList.map(address => Project(address).methods.getSummary().call() )
    );
    console.log('project list........', { summaryList });
    const projects = addressList.map((address, i) => {
      const [description, minInvest, maxInvest, goal, balance, investorCount, paymentCount, owner] = Object.values(
        summaryList[i]
      );

      return {
        address,
        description,
        minInvest,
        maxInvest,
        goal,
        balance,
        investorCount,
        paymentCount,
        owner,
      };
    });

    return {projects};
  }

  // async componentDidMount() {
  //   const accounts = await web3.eth.getAccounts();
  //   const balances = await Promise.all(accounts.map(x => web3.eth.getBalance(x)));
  //   this.setState({ accounts: accounts.map((x, i) => ({ account: x, balance: balances[i] })) });
  // }

  render () {
    // const { accounts } = this.state;
    const { projects } = this.props;
    return (
      <Layout>
        <Grid container spacing={16}>
          {projects.map(this.renderProject)}
        </Grid>
      </Layout>
    );
  }

  renderProject(project) {
    const progress = project.balance / project.goal * 100;
    return (
      <Grid item md={6} key={project.address}>
        <Card>
          <CardContent>
          <h3>{project.description}</h3>
          <LinearProgress style={{ margin: '10px 0' }} color="primary" variant="determinate" value={progress} />
            <Grid container spacing={16}>
              <InfoBlock title={`${web3.utils.fromWei(project.goal, 'ether')} ETH`} description="募资上限" />
              <InfoBlock title={`${web3.utils.fromWei(project.minInvest, 'ether')} ETH`} description="最小投资金额" />
              <InfoBlock title={`${web3.utils.fromWei(project.maxInvest, 'ether')} ETH`} description="最大投资金额" />
              <InfoBlock title={`${project.investorCount}人`} description="参投人数" />
              <InfoBlock title={`${web3.utils.fromWei(project.balance, 'ether')} ETH`} description="已募资金额" />
            </Grid>
          </CardContent>
          <CardActions>
            <Link route={`/projects/${project.address}`}>
              <Button size="small" color="primary">
                立即投资
              </Button>
            </Link>
            <LinearProgress color="primary" variant="determinate" value={progress} />
            <Link route={`/projects/${project.address}`}>
              <Button size="small" color="secondary">
                查看详情
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withRoot(Index);