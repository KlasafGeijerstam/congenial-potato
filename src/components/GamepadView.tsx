import styled from '@emotion/styled';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import React, {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import { useGamepads } from '../providers/GamepadsProvider';
import { ServoMap, useServos } from '../providers/ServosProvider';

const CustomCard = styled(Card)`
  width: 40rem;
`;

interface GamepadViewProps {
  gamepad: Gamepad;
}

interface GamepadAxisProps {
  index: number;
  value: number;
  servos: ServoMap;
  servoNameHash: string;
  axisMappingChange: (axis: number, servoId: number) => void;
}

interface ServoSelectProps {
  servoMapping: number;
  // eslint-disable-next-line react/no-unused-prop-types
  servoNameHash: string;
  servos: ServoMap;
  setServoMapping: (id: number) => void;
}

const ServoSelect = React.memo(({
  servoMapping,
  servos,
  setServoMapping,
}: ServoSelectProps) => (
  <Select
    value={servoMapping}
    onChange={(v) => setServoMapping(v.target.value as number)}
  >
    <MenuItem value={-1}>Unbound</MenuItem>
    {Array.from(servos.values()).map((servo) => (
      <MenuItem key={servo.id} value={servo.id}>
        {servo.name}
      </MenuItem>
    ))}
  </Select>
), (prev, next) => (prev.servoNameHash === next.servoNameHash
  && prev.servoMapping === next.servoMapping
));

const GamepadAxis: FC<GamepadAxisProps> = ({
  index,
  value,
  servos,
  servoNameHash,
  axisMappingChange,
}) => {
  const [servoMapping, setServoMapping] = useState(-1);

  useEffect(() => {
    axisMappingChange(index, servoMapping);
  }, [servoMapping]);

  const StyledDivider = styled(Divider)`
    margin: 1em 0 1em 0;
  `;

  return (
    <>
      <Typography>{`Axis ${index}`}</Typography>
      <Stack direction="row" gap="1em" alignItems="center">
        <Stack sx={{ flexGrow: 1 }} alignItems="center">
          <Typography>{Math.round(value)}</Typography>
          <Slider max={255} min={-255} value={value} />
        </Stack>
        <ServoSelect
          servoMapping={servoMapping}
          setServoMapping={setServoMapping}
          servoNameHash={servoNameHash}
          servos={servos}
        />
      </Stack>
      <StyledDivider />
    </>
  );
};

export default ({ gamepad: { id, axes } }: GamepadViewProps) => {
  const { servos, servoNameHash } = useServos();
  const { setAxisMapping } = useGamepads();
  const axisMappingChange = useCallback((axis: number, servoId: number) => {
    setAxisMapping(id, axis, servoId);
  }, []);

  return useMemo(
    () => (
      <CustomCard>
        <CardHeader title={id} />
        <CardContent>
          {axes.map((axis, index) => {
            const value = axis * 255;
            return (
              <GamepadAxis
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                index={index}
                value={value}
                servos={servos}
                servoNameHash={servoNameHash}
                axisMappingChange={axisMappingChange}
              />
            );
          })}
        </CardContent>
      </CustomCard>
    ),
    [axes, id, servos],
  );
};
