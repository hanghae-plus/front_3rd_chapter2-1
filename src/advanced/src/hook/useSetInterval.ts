import { useEffect, useRef } from 'react';

export const useSetInterval = (callback: () => void, delay: number | null) => {
	const savedCallback = useRef<() => void>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) {
			return;
		}

		const tick = () => {
			if (savedCallback.current) {
				savedCallback.current();
			}
		};

		const id = setInterval(tick, delay);

		return () => clearInterval(id);
	}, [delay]);
};
