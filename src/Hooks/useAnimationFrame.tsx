import { useRef, useEffect } from 'react';

export const useAnimationFrame = (
    run: boolean,
    callback: (deltaTime: number) => void
): void => {
    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | undefined>(undefined);

    const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (!run) {
            requestRef.current = null;
            previousTimeRef.current = undefined;
        } else {
            requestRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(requestRef.current as number);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run]);
};
