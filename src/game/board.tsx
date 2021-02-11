import {Component} from 'react';
import styled, { css } from 'styled-components';
import {controller, Direction, GAME_SIZE, IWinner} from './game';
import {Tile} from './tile';

const SIZE = 400;

enum Keys {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Space = ' ',
  Enter = 'Enter',
}

interface IState {
  winner?: IWinner;
}

export class Board extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    controller.onWin$.subscribe((winner) => {
      this.setState({ winner });
    });
    controller.onReset$.subscribe(() => {
      this.setState({ winner: undefined });
    });
  }

  render() {
    const results = [];
    const winner = this.state ? this.state.winner : null;
    for (let y = 0; y < GAME_SIZE; y++) {
      for (let x = 0; x < GAME_SIZE; x++) {
        const highlight = !!winner &&
            !!winner.line.find(o => o[0] === x && o[1] === y);
        const key = `${x}-${y}`;
        results.push(
          <Tile key={key} y={y} x={x} highlight={highlight} />
        );
      }
    }

    return <Container disabled={!!winner}>{results}</Container>;
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      // Move focus
      case Keys.Up:
        controller.move(Direction.Up);
        break;
      case Keys.Down:
        controller.move(Direction.Down);
        break;
      case Keys.Left:
        controller.move(Direction.Left);
        break;
      case Keys.Right:
        controller.move(Direction.Right);
        break;
      // Select focused
      case Keys.Enter:
        controller.selectFocused();
        break;
      case Keys.Space:
        controller.selectFocused();
    }
  }
}

const Container = styled.div<any>`
  display: flex;
  flex-wrap: wrap;
  width: ${SIZE}px;
  height: ${SIZE}px;
  box-sizing: border-box;
  ${props => props.disabled && css`
    pointer-events: none;
    cursor: default;
  `}
`;
