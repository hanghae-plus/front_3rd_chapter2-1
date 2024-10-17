import { useEffect, useRef } from 'react';

export default function AddToCartButton({ onClick }: { onClick: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.addEventListener('click', onClick);

    return () => {
      buttonRef.current?.removeEventListener('click', onClick);
    };
  }, [buttonRef.current]);

  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      ref={buttonRef}
    >
      추가
    </button>
  );
}
