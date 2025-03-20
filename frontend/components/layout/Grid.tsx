import React from 'react';
import classNames from 'classnames';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  xlCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 1,
  gap = 4,
  smCols,
  mdCols,
  lgCols,
  xlCols,
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };
  
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };
  
  const smColsClasses = smCols ? `sm:${colsClasses[smCols]}` : '';
  const mdColsClasses = mdCols ? `md:${colsClasses[mdCols]}` : '';
  const lgColsClasses = lgCols ? `lg:${colsClasses[lgCols]}` : '';
  const xlColsClasses = xlCols ? `xl:${colsClasses[xlCols]}` : '';
  
  return (
    <div
      className={classNames(
        'grid',
        colsClasses[cols],
        gapClasses[gap],
        smColsClasses,
        mdColsClasses,
        lgColsClasses,
        xlColsClasses,
        className
      )}
    >
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  smSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  mdSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  lgSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  xlSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
  smSpan,
  mdSpan,
  lgSpan,
  xlSpan,
}) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    12: 'col-span-12',
    full: 'col-span-full',
  };
  
  const spanClass = span ? spanClasses[span] : '';
  const smSpanClass = smSpan ? `sm:${spanClasses[smSpan]}` : '';
  const mdSpanClass = mdSpan ? `md:${spanClasses[mdSpan]}` : '';
  const lgSpanClass = lgSpan ? `lg:${spanClasses[lgSpan]}` : '';
  const xlSpanClass = xlSpan ? `xl:${spanClasses[xlSpan]}` : '';
  
  return (
    <div
      className={classNames(
        spanClass,
        smSpanClass,
        mdSpanClass,
        lgSpanClass,
        xlSpanClass,
        className
      )}
    >
      {children}
    </div>
  );
}; 