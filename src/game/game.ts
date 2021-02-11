import { Subject } from 'rxjs';

export const GAME_SIZE = 5;
export const WIN_SIZE = 4;

export enum Player {
  X = 'x',
  O = 'o',
}

export interface ISelection {
  player: Player;
  tile: [number, number];
}

export type Line = number[][];

export enum Direction { Up, Down, Left, Right}

export interface IWinner {
  player: Player;
  line: Line;
}

export const controller = new class {
  tiles!: Player[][];
  winner?: IWinner;
  tile?: [number, number];

  onWin$ = new Subject<IWinner>();
  onFocus$ = new Subject<[number, number]>();
  onSelect$ = new Subject<ISelection>();
  onReset$ = new Subject();

  #currentPlayer: Player = Player.X;
  get currentPlayer(): Player {
    return this.#currentPlayer;
  }

  constructor() {
    this.setup();
  }

  /** Setups up the board at starting state. */
  setup() {
    this.tile = undefined;
    this.winner = undefined;
    this.tiles = Array.from({ length: GAME_SIZE },
        () => new Array(GAME_SIZE).fill(null));
  }

  /** Resets all game state. */
  reset() {
    this.setup();
    this.onReset$.next();
  }

  /** Sets a box with x/o. */
  select(x: number, y: number) {
    const player = this.#currentPlayer;
    this.tiles[y][x] = player;
    this.onSelect$.next({ player, tile: [x, y]});

    // Check for winner
    const line = this.checkWinner(player, x, y);
    if (line) {
      this.winner = { player, line };
      this.onWin$.next(this.winner);
    }

    // Change player
    this.#currentPlayer =
        this.#currentPlayer === Player.X ? Player.O : Player.X;
  }

  /** Select the currently selected tile. */
  selectFocused() {
    if (!this.tile) return;
    this.select(this.tile[0], this.tile[1]);
  }

  /** Gets current player for tile. */
  getPlayer(x: number, y: number): Player|null {
    return this.tiles[y][x];
  }

  /** Moves the current focus in a specific direction. */
  move(direction: Direction) {
    if (!this.tile) {
      this.tile = [0, 0];
      this.onFocus$.next(this.tile);
      return;
    }

    let x = this.tile[0];
    let y = this.tile[1];

    switch (direction) {
        // Move focus
      case Direction.Up:
        if (y > 0) y--;
        break;
      case Direction.Down:
        if (y < GAME_SIZE - 1) y++;
        break;
      case Direction.Left:
        if (x > 0) x--;
        break;
      case Direction.Right:
        if (x < GAME_SIZE - 1) x++;
    }

    if (x !== this.tile[0] || y !== this.tile[1]) {
      this.tile[0] = x;
      this.tile[1] = y;
      this.onFocus$.next(this.tile);
    }
  }

  /** Check the board for a winner. */
  checkWinner(player: Player, startX: number, startY: number): Line|null {
    const boxes = this.tiles;
    let line: Line;
    let x, y;

    // Expect starting point to be set
    if (boxes[startY][startX] !== player) return null;

    // Horizontal
    line = [[startX, startY]];

    // -> Right
    for (let x = startX + 1; x < GAME_SIZE; x++) {
      if (boxes[startY][x] === player) line.push([x, startY]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // -> Left
    for (let x = startX - 1; x >= 0; x--) {
      if (boxes[startY][x] === player) line.push([x, startY]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // Vertical
    line = [[startX, startY]];

    // -> Down
    for (let y = startY + 1; y < GAME_SIZE; y++) {
      if (boxes[y][startX] === player) line.push([startX, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // -> Up
    for (let y = startY - 1; y >= 0; y--) {
      if (boxes[y][startX] === player) line.push([startX, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // Diagonal: Top/Left - Bottom/Right
    line = [[startX, startY]];

    // -> Top/Left
    for (let x = startX - 1, y = startY - 1; x >= 0 && y >= 0; x--, y--) {
      if (boxes[y][x] === player) line.push([x, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // -> Bottom/Right
    for (let x = startX + 1, y = startY + 1; x < GAME_SIZE && y < GAME_SIZE; x++, y++) {
      if (boxes[y][x] === player) line.push([x, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // Diagonal: Bottom/Left - Top/Right
    line = [[startX, startY]];

    // -> Bottom/Left
    for (let x = startX - 1, y = startY + 1; x >= 0 && y < GAME_SIZE; x--, y++) {
      if (boxes[y][x] === player) line.push([x, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    // -> Top/Right
    for (let x = startX + 1, y = startY - 1; x < GAME_SIZE && y >= 0; x++, y--) {
      if (boxes[y][x] === player) line.push([x, y]);
      else break;
    }
    if (line.length >= WIN_SIZE) return line.sort();

    return null;
  }
};
