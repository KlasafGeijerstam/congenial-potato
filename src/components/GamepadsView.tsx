import { FC, useRef } from 'react';
import { useGamepads } from '../providers/GamepadsProvider';
import GamepadView from './GamepadView';

const GamepadsView: FC = () => {
  const { gamepads } = useGamepads();

  return (
    <>
      {
        gamepads.map((gamepad) => (
          <GamepadView key={gamepad.id} gamepad={gamepad} />
        ))
      }
    </>
  );
};

export default GamepadsView;
