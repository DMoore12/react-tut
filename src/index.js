import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className = {props.class} onClick = {props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const hg_style = this.props.hg[i] ? "square red" : "square white";
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        class = {hg_style}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{this.props.status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      highlight: Array(9).fill(false),
      stepNumber: 0,
      high_set: false,
      xIsNext: true,
    };
    this.game_won = false;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const highlight = this.state.highlight.slice();
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    // Check if the game has ended or if we've already clicked this square
    if (this.game_won || squares[i]) {
      return;
    }

    // Update contents of square and square highlighting
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares);
    if (winner) {
      this.game_won = true;
      for (let i = 0; i < winner[1].length; ++i) {
        highlight[winner[1][i]] = true;
      }
    }
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      highlight: highlight,
      xIsNext: !this.state.xIsNext,
    });
  }

  // Jump to proper location in history
  jumpTo(step) {
    this.game_won = false;
    this.setState({
      stepNumber: step,
      highlight: Array(9).fill(false),
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const cats = calculateCats(current.squares);
    
    // Update history
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key = {move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    // Update status
    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else if (cats) {
      status = 'Cat\'s game!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            hg = {this.state.highlight}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }

  return null;
}

function calculateCats(squares) {
  for (let i = 0; i < squares.length; ++i) {
    if (squares[i] === null) {
      return false;
    }
  }

  return true;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

