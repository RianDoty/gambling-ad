import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import SlotMachine from 'react-slot-machine-gen';
import viteLogo from '/vite.svg'
import './App.css'
import stripPng from '../public/strip.png'

const reels = [
  {
    imageSrc: stripPng,
    symbols: [
      {
        title: 'cherry',
        position: 100,
        weight: 2
      },
      {
        title: 'plum',
        position: 300,
        weight: 6
      },
      {
        title: 'orange',
        position: 500,
        weight: 5
      },
      {
        title: 'bell',
        position: 700,
        weight: 1
      },
      {
        title: 'cherry',
        position: 900,
        weight: 3
      },
      {
        title: 'plum',
        position: 1100,
        weight: 5
      }
    ]
  },
  {
    imageSrc: stripPng,
    symbols: [
      {
        title: 'cherry',
        position: 100,
        weight: 2
      },
      {
        title: 'plum',
        position: 300,
        weight: 6
      },
      {
        title: 'orange',
        position: 500,
        weight: 5
      },
      {
        title: 'bell',
        position: 700,
        weight: 1
      },
      {
        title: 'cherry',
        position: 900,
        weight: 3
      },
      {
        title: 'plum',
        position: 1100,
        weight: 5
      }
    ]
  },
  {
    imageSrc: stripPng,
    symbols: [
      {
        title: 'cherry',
        position: 100,
        weight: 2
      },
      {
        title: 'plum',
        position: 300,
        weight: 6
      },
      {
        title: 'orange',
        position: 500,
        weight: 5
      },
      {
        title: 'bell',
        position: 700,
        weight: 1
      },
      {
        title: 'cherry',
        position: 900,
        weight: 3
      },
      {
        title: 'plum',
        position: 1100,
        weight: 5
      }
    ]
  }
]

export class Demo extends React.Component {
  state: Readonly<{play: boolean}>

  constructor(props: any) {
    super(props);

    this.state = {
      play: false
    };
  }

  playEvent() {
    this.setState({
      play: !this.state.play
    });
  }

  render() {
    return (
      <React.Fragment>
        <SlotMachine reels={reels} play={this.state.play} />

        <button id="play-button" onClick={() => this.playEvent()}>Play</button>
      </React.Fragment>
    );
  }
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Demo/>
    </>
  )
}

export default App
