import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ServoId, ServoIdDefault, useServos } from './ServosProvider';

interface GamepadsContextProps {
  gamepads: Gamepad[];
  setAxisMapping: (gamepadId: string, axis: number, servoId: ServoId) => void;
}

const GamepadsContext = React.createContext<GamepadsContextProps>({
  gamepads: [],
  setAxisMapping: () => {},
});

const useGamepads = () => useContext(GamepadsContext);

const getGamepadAxisMappingId = (gamepadId: string, axis: number): string => (
  `${gamepadId},${axis}`
);

const GamepadsProvider: React.FC = ({ children }) => {
  const { updateServo } = useServos();
  const [gamepadAxisMapping, setGamepadAxisMapping] = useState<
    Map<string, ServoId>
  >(new Map());

  const setAxisMapping = (gamepadId: string, axis: number, servoId: ServoId): void => {
    const map = new Map(gamepadAxisMapping);
    map.set(getGamepadAxisMappingId(gamepadId, axis), servoId);
    setGamepadAxisMapping(map);
  };

  const [state, setState] = useState<GamepadsContextProps>({
    gamepads: [],
    setAxisMapping,
  });

  const callbackRef = useRef<number>();

  const updateGamepads = () => {
    const loadedGamepads = navigator
      .getGamepads()
      .filter((gamepad) => gamepad !== null);
    setState({ gamepads: loadedGamepads as Gamepad[], setAxisMapping });
    callbackRef.current = requestAnimationFrame(updateGamepads);
  };

  state.setAxisMapping = setAxisMapping;

  useEffect(() => {
    callbackRef.current = requestAnimationFrame(updateGamepads);
    return () => {
      if (callbackRef.current !== undefined) {
        cancelAnimationFrame(callbackRef.current);
      }
    };
  }, []);

  useEffect(() => {
    state.gamepads.forEach((gamepad) => {
      gamepad?.axes.forEach((axisValue, axisIndex) => {
        const mapping = gamepadAxisMapping.get(getGamepadAxisMappingId(gamepad.id, axisIndex));
        if (mapping !== undefined && mapping !== ServoIdDefault) {
          updateServo(mapping, { Pwm: axisValue });
        }
      });
    });
  }, [state.gamepads]);

  return (
    <GamepadsContext.Provider value={state}>
      {children}
    </GamepadsContext.Provider>
  );
};

export { useGamepads, GamepadsContext, GamepadsProvider };
