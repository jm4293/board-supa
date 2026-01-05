'use client';

import { ChangeEvent, useState } from 'react';

export const useInput = <T = string>(initialValue: T, validator: (value: T) => boolean) => {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value as T;
    if (validator(newValue)) {
      setValue(newValue);
    }
  };

  return {
    value,
    onChange,
    setValue,
  };
};
