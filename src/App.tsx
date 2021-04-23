import { Fragment, MouseEventHandler, Ref, useEffect, useRef, useState } from "react";
import './App.css'
import {checkWinner, ChessComposition, ChessOnIntersection} from './checkWinner'


enum WhoWin {
  None,
  Black,
  White
}

enum WhoMoving {
  Black,
  White
}


const rowNumber = 15;


function App() {
  const originComposition:ChessComposition = new Array(rowNumber).fill(0).map(() => new Array(rowNumber).fill(ChessOnIntersection.None));
  const [whoMoving, changeMover] = useState(WhoMoving.Black) ,
  [whoWin, changeWinner] = useState(WhoWin.None),
  [composition, changeComposition] = useState(originComposition);

  useEffect(() => {
    if(whoWin!==WhoWin.None){
      alert(`${whoWin===WhoWin.Black ? 'Black' : 'White'} win !`)
    }
  }, [whoWin])


  return (
    <div>
      <h1>GoBang</h1>
      <button className="restart"
        onClick={e => {
          changeWinner(WhoWin.None)
          changeMover(WhoMoving.Black)
          changeComposition(new Array(rowNumber).fill(0).map(() => new Array(rowNumber).fill(ChessOnIntersection.None)))
      }}>
        Restart
      </button>
      <div className="gobang">
        <CheckerBoard></CheckerBoard>
        <div className='gobang-container'
          style={{
            gridTemplateColumns: new Array(rowNumber).fill('1fr').join(' '),
            gridTemplateRows: new Array(rowNumber).fill('1fr').join(' ')
        }}>
          {new Array(rowNumber).fill(0).map((v,i) => (
            <Fragment key={i}>
              {new Array(rowNumber).fill(0).map((v,j) => (
                <Intersection
                  key={i+'_'+j}
                  chessMan={composition[i][j]}
                  handleClick={e=>{
                    if(whoWin===WhoWin.None && composition[i][j]===ChessOnIntersection.None){
                      const isBlackMoving = (whoMoving===WhoMoving.Black);
                      composition[i][j] = isBlackMoving ? ChessOnIntersection.Black : ChessOnIntersection.White;
                      changeComposition(composition.slice());
                      checkWinner(composition, i, j) ?
                      changeWinner(isBlackMoving ? WhoWin.Black : WhoWin.White) :
                      changeMover(isBlackMoving ? WhoMoving.White : WhoMoving.Black)
                    }
                  }}
                ></Intersection>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <Notice winner={whoWin} mover={whoMoving}></Notice>
    </div>
  );
}


function CheckerBoard() {
  const gobangBoardCanvas:Ref<HTMLCanvasElement> = useRef(null);
  const canvasWidth = 1000;
  useEffect(() => {
    if(gobangBoardCanvas.current) {
      const ctx = gobangBoardCanvas.current.getContext('2d')
      if(ctx) {
        const gridWidth = canvasWidth/rowNumber
        ctx.fillStyle = '#f1ad70'
        ctx.fillRect(0, 0, 1000, 1000)
        ctx.beginPath();
        for(let i=0; i<rowNumber; i++) {
          ctx.moveTo(gridWidth/2, gridWidth/2+i*gridWidth)
          ctx.lineTo(canvasWidth-gridWidth/2, gridWidth/2+i*gridWidth)
          ctx.moveTo(gridWidth/2+i*gridWidth, gridWidth/2)
          ctx.lineTo(gridWidth/2+i*gridWidth, canvasWidth-gridWidth/2)
        }
        ctx.stroke()
      }
    }
  })

  return (
    <canvas 
      className="gobang-board"
      ref={gobangBoardCanvas}
      width={canvasWidth}
      height={canvasWidth}
    ></canvas>
  )
}


function Intersection({handleClick, chessMan} :{handleClick:MouseEventHandler, chessMan:ChessOnIntersection}) {
  return (
    <div className='intersection-container'>
      <div 
        className={chessMan+' intersection'}
        onClick={handleClick}>
      </div>
    </div>
  ) 
}

function Notice({ winner, mover }:{winner:WhoWin, mover:WhoMoving}) {
  return (
    <div>
      {winner===WhoWin.None ? 
      (<p>{mover===WhoMoving.Black ? 'Black' : 'White'} moving</p>) :
      (<h2>{winner===WhoWin.Black ? 'Black' : 'White'} win !</h2>)
      }
    </div>
  )
}

export default App;
