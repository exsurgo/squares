import { Component  } from 'react';
import styled from 'styled-components';
import { controller, IWinner } from './game';
import { Board } from './board';

interface IState {
  winner?: IWinner;
}

export class Main extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {};

    controller.onWin$.subscribe((winner) => {
      this.setState({ winner });
    });
    controller.onReset$.subscribe(() => {
      this.setState({ winner: undefined });
    });
  }

  render() {
    const { winner } = this.state;

    return (
      <Container>
        {!!winner &&
          <header>
            Player {winner.player} wins! <button onClick={this.reset}>Reset Game</button>
          </header>
        }
        <Board />
      </Container>
    );
  }

  reset() {
    controller.reset();
  }
}

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
