import React, { useState } from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { updateStatusSlider } from '../../../services/CarouseService';
import { toast } from 'react-toastify';

interface Props {
  status: "on" | "off",
  id: number
}

const ToggleButtonStatus: React.FC<Props> = (props) => {
  const { status, id } = props;

  const [statusSlider, setStatusSlider] = useState<"on" | "off">(status);

  const handleSelected = async (value: "on" | "off") => {
    if (value === statusSlider) {
      return;
    }

    const response = await updateStatusSlider(id);
    if (response) {
      const newStatus = response.data.data.status;
      toast.info(`Cập nhật trạng thái slide: ${newStatus}`)
      setStatusSlider(newStatus);
    }
  }

  return (
    <ButtonGroup key={id}>
      <ToggleButton
        key={`status_on_${id}`}
        id={`status_on_-${id}`}
        type="radio"
        variant={'outline-success'}
        name={`radio_${id}`}
        value='on'
        checked={'on' === statusSlider}
        onClick={() => handleSelected('on')}
      >
        ON
      </ToggleButton>

      <ToggleButton
        key={`status_off_${id}`}
        id={`status_off_-${id}`}
        type="radio"
        variant={'outline-danger'}
        name={`radio_${id}`}
        value='off'
        checked={'off' === statusSlider}
        onClick={() => handleSelected('off')}
      >
        OFF
      </ToggleButton>
    </ButtonGroup>
  )
}

export default ToggleButtonStatus
