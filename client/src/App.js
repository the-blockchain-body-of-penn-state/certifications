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
  render() {
    return (
      <View style={styles.container}>
        <Text>Users</Text>

      </View>
    );
  }
}
