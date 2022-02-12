import {
  createContext, FC, useRef, useState, useContext, useCallback,
} from 'react';

export type ServoId = number;
export const ServoIdDefault = -1;

class Servo {
  id: ServoId;

  private pwm: number;

  name: string;

  constructor(servo: Partial<Servo> = {}) {
    this.id = servo.id ?? ServoIdDefault;
    this.pwm = servo.Pwm ?? 0;
    this.name = servo.name ?? 'Servo';
  }

  patch(delta: Partial<Servo> = {}): Servo {
    return new Servo({ ...this, ...delta });
  }

  set Pwm(value: number) {
    this.pwm = value;
  }

  get Pwm() {
    return this.pwm;
  }
}

export type ServoMap = Map<ServoId, Servo>;

interface ServosProviderProps {
  servos: ServoMap;
  servoNameHash: string;
  // eslint-disable-next-line no-unused-vars
  updateServo: (id: ServoId, servo: Partial<Servo>) => void;
  addServo: () => ServoId,
}

const DefaultProps: ServosProviderProps = {
  servos: new Map(),
  updateServo: () => {},
  addServo: () => ServoIdDefault,
  servoNameHash: '',
};

const ServosContext = createContext<ServosProviderProps>(DefaultProps);

const ServosProvider: FC = ({ children }) => {
  const nextServoId = useRef(0);
  const [state, setState] = useState<ServosProviderProps>({ ...DefaultProps });
  const rehashServoNames = (servos: ServoMap): string => Array.from(servos.values()).reduce((acc, servo) => `${acc}${servo.id}${servo.name}`, '');

  const updateServo = useCallback((id: ServoId, servoDelta: Partial<Servo>) => {
    if (id === ServoIdDefault) {
      return;
    }

    setState((prevState) => {
      const oldServo = prevState.servos.get(id);
      if (oldServo !== undefined) {
        const servo = oldServo.patch(servoDelta);
        const servos = new Map(prevState.servos);
        servos.set(id, servo);

        const servoNameHash = servoDelta.name !== undefined
          ? rehashServoNames(servos)
          : prevState.servoNameHash;

        return { ...prevState, servos, servoNameHash };
      }

      return prevState;
    });
  }, [setState]);

  const addServo = useCallback((): ServoId => {
    const servo = new Servo({ id: nextServoId.current, name: `Servo ${nextServoId.current}` });
    const servos = new Map(state.servos);
    servos.set(servo.id, servo);
    const servoNameHash = rehashServoNames(servos);
    setState({ ...state, servos, servoNameHash });
    nextServoId.current += 1;

    return servo.id;
  }, [state.servos, setState]);

  state.addServo = addServo;
  state.updateServo = updateServo;

  return (
    <ServosContext.Provider value={state}>
      { children }
    </ServosContext.Provider>
  );
};

const useServos = () => useContext(ServosContext);

export {
  ServosContext, ServosProvider, useServos, Servo,
};
