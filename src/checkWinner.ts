type ChessComposition = Array<Array<ChessOnIntersection>>

enum ChessOnIntersection{
  None='none',
  Black='black',
  White='white'
}

type ChessPosition = [i:number, j:number]

interface ToNextPosition {
  (previous:ChessPosition): ChessPosition
}

function checkWinner(composition:ChessComposition, i:number, j:number) :boolean{
  const currentChessman = composition[i][j]
  const compositionLength = composition.length
  function isOneLine(toFront:ToNextPosition,toBack:ToNextPosition):boolean{
    return (findLongestLine(toFront)>3) || 
    (findLongestLine(toBack)>3) || 
    (findLongestLine(toFront)+findLongestLine(toBack)>3);
  }
  function findLongestLine(toNext:ToNextPosition) :number{
    let pointer:ChessPosition = toNext([i, j]),
    length = 0;
    while(
      pointer[0] > -1 &&
      pointer[1] > -1 &&
      pointer[0]<compositionLength && 
      pointer[1]<compositionLength
    ) {
      const [m, n] = pointer
      if(composition[m][n]===currentChessman){
        length++
        pointer = toNext(pointer)
      }else break
    }
    return length
  }

  return isOneLine(([i,j])=>[i+1,j], ([i,j])=>[i-1,j]) ||
  isOneLine(([i,j])=>[i,j+1], ([i,j])=>[i,j-1]) ||
  isOneLine(([i,j])=>[i+1,j+1], ([i,j])=>[i-1,j-1])
}

export {
  ChessOnIntersection,
  checkWinner
};

export type { ChessComposition };
 