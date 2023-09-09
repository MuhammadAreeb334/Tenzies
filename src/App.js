import React from "react"
import Die from "./Die";
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [roll, setRoll] = React.useState(0)
  const [second, setSecond] = React.useState(0)
  const [minute, setMinute] = React.useState(0)
  const [hour, setHour] = React.useState(0)
  const [start, setStart] = React.useState(false)

  if(second > 59) {
    setSecond(0)
    setMinute(prevMinute => prevMinute + 1)

  } else if(minute > 59) {
    setMinute(0)
    setHour(prevHour => prevHour + 1)

  } else if(hour > 23) {
    setSecond(0)
    setMinute(0)
    setHour(0)
  }

  React.useEffect(() => {
    const timer = setInterval( () => {
      if(!start) {
        return

      } else if(tenzies){
        return

      } else {
        setSecond(prevSecond => prevSecond + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [start, !tenzies])


  React.useEffect( () => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if(allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])


  function generateNewDice() {
    return {
      value: Math.floor(Math.random() * 6) + 1, 
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {    
    const DiceArr = []
    for(let i = 0; i < 10 ; i++) {
      DiceArr.push(generateNewDice())
    }
    return DiceArr
  }

  function rollDice() {
    if(!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
        die :
        generateNewDice()
      }))
      setRoll(prevRoll => prevRoll + 1)
    } else {
      setRoll(0)
      setHour(0)
      setMinute(0)
      setSecond(0)
      setStart(false)
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  function holdDice(id) {
    setStart(true)
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
      {...die, isHeld: !die.isHeld} :
      die
    }))
  }

  const diceElement = dice.map(die => (
    <Die value = {die.value} key = {die.id} isHeld = {die.isHeld} holdDice ={() => holdDice(die.id)} />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      {!start && <h1 className="title">Tenzies</h1>}
      {!start && <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>}
      {start && <div className="started">
        <h1 className="timer">
          Time: {String(hour).padStart(2, '0')}: {String(minute).padStart(2, '0')}: {String(second).padStart(2, '0')}
        </h1>
        <h1>Count: {roll}</h1>
      </div>}
      <div className="dice-container">
        {diceElement}
      </div>
      <button className="roll-btn" onClick={rollDice}>{tenzies ? 'New Game' : 'Roll Dice'}</button>
    </main>
  );
}

