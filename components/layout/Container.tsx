import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
        </div>
    );
};