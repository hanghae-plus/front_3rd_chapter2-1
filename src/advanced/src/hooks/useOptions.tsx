import { useCallback, useState } from "react";

export default function useOptions<T extends { id: string; val: number }>(initialOptions: T[]) {
  const [options, setOptions] = useState<T[]>(() => initialOptions);

  const updateOption = useCallback((id: string, data: Partial<T>) => {
    setOptions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, ...data };
      }),
    );
  }, []);

  return { options, updateOption };
}
