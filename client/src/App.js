import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Api, JsonRpc, RpcError } from 'eosjs';
import ScatterJS, { Network } from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 120,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

const network = Network.fromJson({
    blockchain:'eos',
    protocol:'http',
    host:'127.0.0.1',
    port:8888,
    chainId: process.env.REACT_APP_CHAIN_ID,
    name: 'localhost'
});

const rpc = new JsonRpc(network.fullhost());

export default class App extends React.Component {
  state = {
    identity: null,
    scatterConnectError: '',
  }

  scatterLogin = async () => {
    ScatterJS.plugins( new ScatterEOS() );
    try {
      const connected = await ScatterJS.scatter.connect('My-App');
      if (!connected) return false;
      const scatter = await ScatterJS.scatter;
      const requiredFields = { accounts:[network] };
      const identity = await scatter.getIdentity(requiredFields);
      setState({
        identity: identity
      })
    } catch (err) {
      console.log(err);
      this.setState({scatterConnectError: 'Could not connect to Scatter'});
    }
  }

  scatterPay = async () => {
    ScatterJS.plugins( new ScatterEOS() );
    try {
      const connected = await ScatterJS.scatter.connect('My-App');
      if (!connected) return false;
      const scatter = await ScatterJS.scatter;
      const requiredFields = { accounts:[network] };
      const identity = await scatter.getIdentity(requiredFields);
      if (identity) {
        this.setState(identity);
        const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
        console.log(account)
        const api = scatter.eos(network, Api, { rpc, beta3:true });
        console.log(api);
        try {
          const trx = await api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: account.name,
                permission: account.authority,
              }],
              data: {
                from: account.name,
                to: 'james',
                quantity: '3.0000 EOS',
                memo: `from ${account.name}`,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          console.log(trx);

          scatter.forgetIdentity();
        } catch (e) {
          console.log('\nCaught exception: ' + e);
          if (e instanceof RpcError)
            console.log(JSON.stringify(e.json, null, 2));
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({scatterConnectError: 'Could not connect to Scatter'});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Users</Text>

      </View>
    );
  }
}
