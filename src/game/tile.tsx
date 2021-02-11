import {Component} from 'react';
import styled, { css } from 'styled-components';
import {controller, GAME_SIZE, Player} from './game';

interface IProps {
  x: number;
  y: number;
  highlight?: boolean;
  disable?: boolean;
}

interface IState {
  player?: Player;
  focused?: boolean;
}

export class Tile extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {}
  }

  render() {
    const { player, focused } = this.state;
    const { x, y, highlight } = this.props;
    const icon = !player ? '' : player === Player.X ? '❌' : '⭕';

    return (
      <Container disable={!!player}
                 focused={focused}
                 highlight={highlight}
                 onClick={() => this.onSelect()}>
        <Inner>{icon}</Inner>
      </Container>
    );
  }

  componentDidMount() {
    controller.onFocus$.subscribe((tile) => {
      this.setState({ focused: this.isSelf(tile) });
    });
    controller.onSelect$.subscribe((selection) => {
      if (this.isSelf(selection.tile)) {
        this.setState({ player: selection.player });
      }
    });
    controller.onReset$.subscribe(() => {
      this.setState({ player: undefined });
    });
  }

  onSelect() {
    if (this.state.player) return;
    const { x, y } = this.props;
    controller.select(x, y);
  }

  isSelf(tile: [number, number]): boolean {
    const { x, y, highlight } = this.props;
    return tile && tile[0] === x && tile[1] === y;
  }
}

const Container= styled.div<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% / ${GAME_SIZE});
  height: calc(100% / ${GAME_SIZE});
  box-sizing: border-box;
  border: 2px solid #aaa;
  cursor: ${(props) => props.disable ? 'default' : 'pointer'};
  background-color: ${(props) => props.highlight && 'lightblue'};
  ${(props) => props.focused && 'border: 2px solid blue;'}
`;

const Inner = styled.span`
  font-size: 55px;
`;
