import React, { useState } from 'react';
import { FormControl, Box } from '@mui/material';
import { ChromePicker } from 'react-color';
import { useContext } from 'react';
import { MyContext } from './Contextapi';

const ColorPicker = () => {
  const { textcolor, settextcolor } = useContext(MyContext);

  const handleChange = (newColor) => {
    settextcolor(newColor.hex);
  };

  return (
    <FormControl>
      <Box
        style={{ marginTop: '10px', marginBottom: '5px' }}
        display='flex'
        alignItems='center'
      >
        <ChromePicker color={textcolor} onChange={handleChange} disableAlpha={true} />
      </Box>
    </FormControl>
  );
};

export default ColorPicker;
