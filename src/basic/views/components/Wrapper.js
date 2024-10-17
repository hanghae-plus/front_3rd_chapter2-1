import { createDiv } from '../createElements';

export const createWrapper = () => {
  return createDiv({
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
};