import { ButtonHTMLAttributes } from 'react';

type ButtonColor = 'blue' | 'red';
type ButtonSize = 'm' | 'l';

const BUTTON_COLOR: Record<ButtonColor, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  m: 'px-2 py-1',
  l: 'px-4 py-2',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  colorVariants?: ButtonColor;
  size?: ButtonSize;
}

export const Button = ({
  text,
  colorVariants = 'blue',
  size = 'm',
  type = 'button',
  className = '',
  ...rest
}: Props) => {
  return (
    <button
      className={`${BUTTON_COLOR[colorVariants]} text-white ${BUTTON_SIZE[size]} rounded ${className}`}
      {...rest}
    >
      {text}
    </button>
  );
};
