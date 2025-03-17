import React, { useLayoutEffect, useRef, useState } from 'react';

import classes from './ProgressBar.module.css';

interface ProgressBarProps {
    style?: React.CSSProperties;
    progress: number; // 0.0 - 1
    animationClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, []);

    return (
        <div ref={ref} className={classes.base} style={props.style}>
            <div
                className={`${classes.progress} ${props.animationClass}`}
                style={{
                    transform: `translate(-${width * (1 - props.progress)}px)`,
                }}
            ></div>
        </div>
    );
};

export default ProgressBar;
