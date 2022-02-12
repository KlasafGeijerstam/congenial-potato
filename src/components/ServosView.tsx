import {
  Button, Card, CardContent, CardHeader,
} from '@mui/material';
import { FC } from 'react';
import { Servo, useServos } from '../providers/ServosProvider';

const ServoCard: FC<{ servo: Servo }> = ({ servo }) => (
  <Card>
    <CardHeader title={servo.id} subheader={servo.name} />
    <CardContent>
      {servo.Pwm}
    </CardContent>
  </Card>
);

const ServosView: FC = () => {
  const { servos, addServo } = useServos();
  return (
    <>
      {
        Array.from(servos.values()).map((servo) => (
          <ServoCard key={servo.id} servo={servo} />
        ))
      }
      <Button variant="contained" onClick={addServo}>Add servo</Button>
    </>
  );
};

export default ServosView;
