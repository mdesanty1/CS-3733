import React from 'react';
import './App.css';
import ninjase from '../src/ninja-se.svg'
import Model from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary.js'
import {UP, DOWN, LEFT, RIGHT} from './model/Model.js'

function App() {
  // initial instantiation of the Model

  const [model, setModel] = React.useState(new Model(0));  //start with 5x5
  const [redraw, forceRedraw] = React.useState(0);    // change values to force redraw

  const appRef = React.useRef(null);      // Later need to be able to refer to App 
  const canvasRef = React.useRef(null);   // Later need to be able to refer to Canvas
  let winNumber = 0

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect (() => {
    
    /** Happens once. */
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model, redraw])   // this second argument is CRITICAL, since it declares when to refresh (whenever Model changes)
  
  // controller to handle moving
  const moveNinjaSe = (direction) => {
    let done = model.board.isWon()
    //if the game is done, go to check
    if(done){
      check()
    }
    //if game is not done, continue
    model.moveNinjase(direction)
    forceRedraw(redraw+1)   // react to changes, if model has changed.
  }

  const newBoard = (which) => {
    let done = model.board.isWon()
    //if the game is done, go to check
    if(done){
      check()
    }
    //if game is not done, continue
    // tell model to change
    model.initialize(which)
    forceRedraw(redraw+1)   // react to changes, if model has changed.
  }

  const resetBoard = () => {
    // tell model to change
    model.initialize(model.which)
    forceRedraw(redraw+1)   // react to changes, if model has changed
  }

  //method to remove block of 4
  const removeBlock = () => {
    //if game is not done, continue
    let win = model.removeBlock()
    forceRedraw(redraw + 1)
    if(win){
      winNumber = 1
      alert("You have completed the game. The move buttons will now be removed. Please select a new configuration to restart")
    }
  }
  //method to determine if the game has ended
  //returns string when the board is cleared
  const check = () => {
    //need to figure out how to disable
    if(winNumber == 1){
      return "You have won. Please select a new configuration to play again"
    }
    return "The game is still in progress"
  }

  return (
    <div className="App" ref={appRef}>
      <canvas tabIndex="1"  
        data-testid="canvas"
        className="App-canvas"
        ref={canvasRef}
        width={500}
        height={500}
        />
      <label className="game_status">Game Status: {check()} </label>  
      <label className="game_count">Number of Moves: {model.numberOfMoves()} </label> 
      <label className="game_score">Score: {model.currScore()} </label> 

       {model.board.isWon() != 1 ? (<button className="upbutton" data-testid="upbutton"   onClick={(e) => moveNinjaSe(UP)}   >up</button>): null}
       {model.board.isWon() != 1 ? (<button className="downbutton" data-testid="downbutton"   onClick={(e) => moveNinjaSe(DOWN)}   >down</button>): null}
       {model.board.isWon() != 1 ? (<button className="leftbutton" data-testid="leftbutton"   onClick={(e) => moveNinjaSe(LEFT)}   >left</button>): null}
       {model.board.isWon() != 1 ? (<button className="rightbutton" data-testid="rightbutton"   onClick={(e) => moveNinjaSe(RIGHT)}   >right</button>): null}
        
       <button className="firstConfig" data-testid="firstConfig"   onClick={(e) => newBoard(0)}   >first configuration</button>
       <button className="secondConfig" data-testid="secondConfig"   onClick={(e) => newBoard(1)}   >second configuration</button>
       <button className="thirdConfig" data-testid="thirdConfig"   onClick={(e) => newBoard(2)}   >third configuration</button>

       <button className="resetBoard" data-testid="resetBoard"   onClick={(e) => resetBoard()}   >Reset Board</button>
       <button className="removeBlock" data-testid="removeBlock"   onClick={(e) => removeBlock()}   >Remove Block</button>

       <img id="ninjase" src={ninjase} alt="hidden" hidden></img>



     
    </div>
  );
}

export default App;
