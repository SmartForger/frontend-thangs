import React, { useState } from 'react';
import { createUseStyles } from '@style'

const COLORS = [
    '#dbdbdf',
    '#88888b',
    '#464655',
    '#1cb2f5',
    '#014d7c',
    '#ffbc00',
    '#b18002',
    '#c7eeff',
]

const useStyles = createUseStyles(theme => {
    return {
        ColorPicker: {
            cursor: 'pointer',
            position: 'relative',
        },
        ColorPicker_BlockPicker: {
            display: ({visible}) => visible ? 'grid' : 'none',
            backgroundColor: theme.color.cardBackground,
            position: 'absolute',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '.75rem',
            padding: '1.5rem',
            bottom: 'calc(100% + 1.5rem)',
            left: '1rem',
            transform: 'translateX(-50%)',
            borderRadius: '.25rem',
            ...theme.shadow,
        
            '&:after': {
                content: '',
                position: 'absolute',
                top: 'calc(100% - 1px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderTop: `solid 8px ${theme.color.cardBackground}`,
                borderLeft: 'solid 6px transparent',
                borderRight: 'solid 6px transparent',
                zIndex: 1,
            }
        },
        ColorPicker_Color: {
            cursor: 'pointer',
            height: '1.5rem',
            width: '1.5rem',
            borderRadius: '100%',
            backgroundColor: ({color}) => color,
            boxSizing: 'border-box',
        },
        ColorPicker__isSelected: {
            border: `1px solid ${theme.color.cardBackground}`,
            boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.5)',
        },
}

function BlockPicker({ currentColor, onChange, visible }) {
    const c = useStyles({visible, color})
    return (
        <div className={c.ColorPicker_BlockPicker} visible={visible}>
            {COLORS.map((color, idx) => {
                const isSelected = color === currentColor
                return (
                    <div 
                    className={classnames(c.ColorPicker_Color, {
                        [c.ColorPicker__isSelected]: isSelected,
                    })}
                    color={color}
                    onClick={() => onChange(color)}
                    key={idx}
                />
                )
            })}
        </div>
    );
}

export function ColorPicker({ color = '#FFFFFF', onChange, children }) {
    const c = useStyles({visible, color})
    const [visible, setVisible] = useState();

    const toggleVisible = () => {
        setVisible(!visible);
    };

    const handleChange = (...args) => {
        onChange(...args);
        toggleVisible();
    };

    return (
        <div className={c.ColorPicker} color={color} onClick={toggleVisible}>
            <BlockPicker
                currentColor={color}
                onChange={handleChange}
                visible={visible}
            />
            {children}
        </div>
    );
}
