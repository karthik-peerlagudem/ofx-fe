import React from 'react';
import classes from './Flag.module.css';

interface FlagProps {
    code: string;
}

const Flag: React.FC<FlagProps> = ({ code }) => (
    <img
        alt={code || ''}
        src={`/img/flags/${code || ''}.svg`}
        width="20px"
        className={classes.flag}
        data-testid={`flag-${code}`}
    />
);

export default Flag;
