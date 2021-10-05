import './resizable.css';
import { FC, useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
    direction: 'horizontal' | 'vertical';
}

const Resizable: FC<ResizableProps> = ({ direction, children }) => {
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const maxWidth = innerWidth * 0.8;
    const [width, setWidth] = useState(maxWidth);

    useEffect(() => {
        let timer: any;
        const resizer = () => {
            if (timer) clearTimeout(timer);
            setTimeout(() => {
                setInnerHeight(window.innerHeight);
                setInnerWidth(window.innerWidth);
                if (maxWidth < width) setWidth(maxWidth);
            }, 100);
        };
        window.addEventListener('resize', resizer);
        return () => window.removeEventListener('resize', resizer);
    }, [width, maxWidth]);

    const resizableProps: ResizableBoxProps =
        direction === 'horizontal'
            ? {
                  className: 'resizable-horizontal',
                  height: Infinity,
                  width,
                  resizeHandles: ['e'],
                  minConstraints: [300, Infinity],
                  maxConstraints: [maxWidth, Infinity],
                  onResizeStop: (_event, { size }) => setWidth(size.width),
              }
            : {
                  height: 300,
                  width: Infinity,
                  resizeHandles: ['s'],
                  maxConstraints: [Infinity, innerHeight * 0.96],
              };

    return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
