// @flow
'use strict'

import React, { Component } from 'react'
import { Button } from 'react-native';

const States = {
    INIT: 0,
    SECOND: 1,
    THIRD: 2
  };

 export class StateMachine extends Component {

    state = {
      current: States.INIT
    };

    transition(to: number) {
      this.setState({current: to});
    }

    render() {
      switch(this.state.current) {
        case States.SECOND:
          return this.renderSecond();
        case States.THIRD:
          return this.renderThird();
        case States.INIT:
        default:
          return this.renderInit();
      }
    }

    renderInit() {
      return (
        <Button title= {'Go to state 2'} onPress={() => this.transition(States.SECOND)}>
        </Button>
      );
    }

    renderSecond() {
      return (
        <Button title= {'Go to state 3'} onPress={() => this.transition(States.THIRD)}>
        </Button>
      );
    }
    
    renderThird() {
      return (
        <Button title= {'Go back to the initial state'} onPress={() => this.transition(States.INIT)}>
        </Button>
      );
    }
  }

  export default StateMachine;