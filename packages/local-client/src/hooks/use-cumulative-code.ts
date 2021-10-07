import { useTypedSelector } from './use-typed-selector';

const showFunc = `
    import $__React from 'react';
    import $__ReactDOM from 'react-dom';

    const $__root = document.querySelector('#root');
    const $__show = (value) => $__root.innerHTML = value;
    var show = (value) => {
        if (typeof value === 'object') {
            const isReactDOM = value.$$typeof && value.props;
            if (isReactDOM) {
                $__ReactDOM.render(value, $__root);
            } else {
                $__show(JSON.stringify(value));
            }
        } else {
            $__show(value)
        }
    };
`;
const showFuncNoop = 'var show = () => {};';

export const useCumulativeCode = (cellId: string): string => {
    const codes = useTypedSelector(({ cells }) => {
        if (!cells) return;
        const { data, order } = cells;
        const orderedCells = order.map((id) => data[id]);
        const contents = [];
        for (let c of orderedCells) {
            if (c.type === 'code') {
                contents.push(c.id === cellId ? showFunc : showFuncNoop);
                contents.push(c.content);
            }
            if (c.id === cellId) break;
        }
        return contents;
    });
    return codes?.join('\n') || '';
};
