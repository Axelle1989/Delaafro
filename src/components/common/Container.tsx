import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 max-w-[1920px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
