import React, { FC } from 'react';
type Props = {
    label: string;
}

export const Button: FC<Props> = ({ label }) => {
    return <button>{label}</button>;
}

export default Button;
