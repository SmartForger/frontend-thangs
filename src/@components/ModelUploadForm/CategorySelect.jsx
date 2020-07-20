import React from 'react';
import Select from 'react-select';
import styled from 'styled-components/macro';

const CATEGORIES = [
    { value: 'automotive', label: 'Automotive' },
    { value: 'aerospace', label: 'Aerospace' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'home', label: 'Home' },
    { value: 'safety', label: 'Safety' },
    { value: 'characters', label: 'Characters' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'technology', label: 'Technology' },
    { value: 'hobbyist', label: 'Hobbyist' },
];

const DropdownIndicator = styled.div`
    width: 0;
    height: 0;
    margin-right: 16px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;

    /* We unfortunately need to hardcode this value because of how react-select works */
    border-top: 8px solid #f5f5f5;
`;

export function CategorySelect({ setCategory }) {
    return (
        <Select
            name="category"
            placeholder="Select Category"
            isClearable
            options={CATEGORIES}
            onChange={({ value }) => setCategory(value)}
            components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: ({ cx, ...props }) => {
                    // cx causes React to throw an error, so we remove it
                    return <DropdownIndicator {...props} />;
                },
            }}
            styles={{
                control: base => {
                    return {
                        ...base,
                        minHeight: 'auto',
                        borderRadius: '8px',
                        backgroundColor: '#616168',
                        border: 'none',
                    };
                },
                singleValue: base => {
                    return {
                        ...base,
                        margin: 0,
                        color: '#f5f5f5',
                    };
                },
                placeholder: base => {
                    return {
                        ...base,
                        margin: 0,
                        color: '#f5f5f5',
                    };
                },
                clearIndicator: base => {
                    return {
                        ...base,
                        color: '#f5f5f5',
                        padding: '7px',
                    };
                },
                input: base => {
                    return {
                        ...base,
                        margin: 0,
                        padding: 0,
                    };
                },
                valueContainer: base => {
                    return {
                        ...base,
                        padding: '8px 16px',
                    };
                },
            }}
        />
    );
}
