import { useCallback, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import './App.css'
import stripPng from '/strip.png?url'

import minorJackpotSound from '/minor-jackpot.mp3?url'
import majorJackpotSound from '/major-jackpot.mp3?url'
import reelsBeginSound from '/reelsBegin.mp3?url'
import reelsEndSound from '/reelsEnd.mp3?url'

import SlotMachineGen from 'slot-machine-gen';
import 'slot-machine-gen/dist/slot-machine.min.css';

// Reels for the interactive thing; it doesn't work if they have the same reference,
// for some reason, so they gotta be different.
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
        title: 'orange',
        position: 300,
        weight: 5
      },
      {
        title: 'bell',
        position: 500,
        weight: 1
      },
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
        title: 'orange',
        position: 300,
        weight: 5
      },
      {
        title: 'bell',
        position: 500,
        weight: 1
      },
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
        title: 'orange',
        position: 300,
        weight: 5
      },
      {
        title: 'bell',
        position: 500,
        weight: 1
      },
    ]
  }
]

const minorJackpotHowl = new Howl({src: minorJackpotSound})
const majorJackpotHowl = new Howl({src: majorJackpotSound, volume: 0.35})

let made = false;
function App() {
  // Whether or not to show the slogan
  const [showSlogan, setShowSlogan] = useState(false)
  // Whether or not the slots are spinning
  const [isSpinning, setIsSpinning] = useState(false);
  // How many credits we have
  const [credits, setCredits] = useState(4); // No need to force credits to be above 0; we're never getting there!
  // References the div to put the slot machine inside of
  const wrapperRef = useRef<HTMLDivElement>(null)
  // References the slot machine object
  const slotRef = useRef<typeof SlotMachineGen>(null)

  const cherryWin = useCallback(() => {
    minorJackpotHowl.play()
    setCredits(c => c + 2)
  }, [])
  const orangeWin = useCallback(() => {
    minorJackpotHowl.play()
    setCredits(c => c + 5)
  }, [])

  // This one's a bit more involved; i wanna keep ticking up the credits bit by bit on a timer.
  const jackpotWin = useCallback(() => {
    // Play jackpot sound
    majorJackpotHowl.play()

    const interval = 100 // in ms
    const credits = 50
    let added = 0
    const id = setInterval(() => {
      setCredits(c => c + 1)
      added += 1;
      if (added >= credits) clearInterval(id)

      if (added == 30) setShowSlogan(true)
    }, interval)
  }, [])

  // Called whenever the slot machine ends,
  // with the resulting symbols as arguments
  const onEnd = useCallback((symbols: {title: string}[]) => {
    setIsSpinning(false)

    if (symbols[0].title == symbols[1].title && symbols[1].title == symbols[2].title) { // Check for 3 consecutive symbols, award credits based on which (cherry = low, orange = mid, bell = jackpot)
      switch(symbols[0].title) {
        case 'cherry':
          cherryWin()
          break;
        case 'orange':
          orangeWin()
          break;
        case 'bell':
          jackpotWin()
          break;
        case 'default':
          alert('peter how are you doing that')
          break;
      }
    } else if (credits == 0) { // Supposed to be a guarenteed win, but it's nice to rig it anyways
      jackpotWin()
    }
  }, [credits])

  // Stores the current onEnd function in a reference so it can be swapped
  const onEndRef = useRef<Function>(onEnd)
  onEndRef.current = onEnd

  // Make the slot machine
  useEffect(() => {
    if (made == true) return;
    slotRef.current = new SlotMachineGen(wrapperRef.current, reels, (s: any)=>onEndRef.current(s), {click2Spin: false, animSpeed: 1000, rngFunc: () => 0, sounds: {reelsBegin: reelsBeginSound, reelsEnd: reelsEndSound}})
    made = true;
  }, [])


  // Sets the RNG function to output the numbers inside in sequence.
  // For reference, a single roll uses 6 rng calls,
  // 3 for the reels and 3 for timing.
  // 
  function setRigged(results: number[]) {
    let i = 0;

    function getNext() {
      const out = results[i]
      i++
      return out
    }

    slotRef.current.options.rngFunc = getNext
  }

  function doPlay() {
    const slots = slotRef.current
    
    // Rig the RNG based on the state, then play.
    switch(credits) {
      case 4:
        setRigged([0,0.2,0.7,0.5,0,0.2])

        break;
      case 3:
        setRigged([0.3,0.5,0.2,0.8,0,0.2])

        break;
      case 2:
        setRigged([0.99,0.2,0,0.9,0.99,0.4])
        break;
      
      case 1:
        // Time to win! Set RNG to all bells.
        setRigged([0.99,0.2,0.99,0.35,0.99,0.7])

        break;

      default:
        // Normal RNG
        slotRef.current.options.rngFunc = () => Math.random()
    }

    setCredits(c => c - 1)
    setIsSpinning(true)
    slots.play()
  }

  return (
    <>
      <h1 className={showSlogan? 'slogan show-slogan' : 'slogan'}>Now isn't this fun.</h1>
      <div id={"game"} className="slot-machine" ref={wrapperRef} ></div>
      <button id="play-button" onClick={doPlay} disabled={isSpinning}>Play (Costs 1 Credit)</button>
      <h1>Credits: {credits}</h1>
    </>
  )
}

export default App
