import { ButtonHTMLAttributes } from 'react';

type ButtonColor = 'blue' | 'red';

const BUTTON_COLOR: Record<ButtonColor, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  colorVariants?: ButtonColor;
}

export const Button = ({
  text,
  colorVariants = 'blue',
  type = 'button',
  ...rest
}: Props) => {
  return (
    <button
      className={`${BUTTON_COLOR[colorVariants]} text-white px-2 py-1 rounded mr-1`}
      {...rest}
    >
      {text}
    </button>
  );
};
