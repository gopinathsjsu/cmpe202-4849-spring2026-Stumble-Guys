import React from 'react';
import Button from '../shared/Button_Preetam';

type Props = {
  onClick: () => Promise<void> | void;
  disabled?: boolean;
};

const RSVPButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={() => void onClick()}
    >
      RSVP
    </Button>
  );
};

export default RSVPButton;

