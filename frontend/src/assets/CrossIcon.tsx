import React, { ReactElement, MouseEvent } from 'react';

interface CloseButtonProps {
    onClick: (event: MouseEvent<SVGElement>) => void;
    strokeColor?: string;
    style?: React.CSSProperties;
}

const CrossIcon: React.FC<CloseButtonProps> = ({ onClick, style }): ReactElement => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='19'
            height='19'
            viewBox='0 0 20 20'
            fill='none'
            style={{
                position: 'absolute',
                right: '2rem',
                top: '2rem',
                flexShrink: 0,
                cursor: 'pointer',
                ...style, // Merge provided style with default styles
            }}
            onClick={onClick}>
            <path d='M0.5 0.5L19.5 19.5M0.5 19.5L19.5 0.5' stroke='black' />
        </svg>
    );
};

export default CrossIcon;
