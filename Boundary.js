/** Redraw entire canvas from model. */


export function redrawCanvas(model, canvasObj, appObj) {
    const ctx = canvasObj.getContext('2d');
    const image = document.getElementById('ninjase')
    if (ctx === null) { return; }    // here for testing purposes...
    
    // clear the canvas area before rendering the coordinates held in state
    ctx.clearRect( 0,0, canvasObj.width, canvasObj.height);  

    // draws squares based on information? Perhaps you can use some of this concept
    let size = model.board.size
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let square = model.board.grid[r][c]
        let x = c * 100
        let y = r * 100
        let w = 100
        let h = 100
        ctx.fillStyle = square.color
        ctx.fillRect(x, y, w, h)
      }
    }

    
    // THEN draw ninjase
    //ctx.fillStyle = 'green'
    //let x = model.ninjaCol * 50
    //let y = model.ninjaRow * 50
    console.log(model)
    ctx.drawImage(image,model.board.ninjaCol * 100, model.board.ninjaRow * 100, 200, 200)
}