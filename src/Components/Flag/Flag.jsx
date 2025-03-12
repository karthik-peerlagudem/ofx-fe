import classes from './Flag.module.css';

import PropTypes from 'prop-types';

const Flag = ({ code }) => (
    <img
        alt={code || ''}
        src={`/img/flags/${code || ''}.svg`}
        width="20px"
        className={classes.flag}
        data-testid={`flag-${code}`}
    />
);

Flag.propTypes = {
    code: PropTypes.string,
};

export default Flag;
