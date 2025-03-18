import React from 'react';
import { useTranslation } from 'next-i18next';
import { Empty } from './Empty';

interface TableColumn<T> {
  title: React.ReactNode;
  dataIndex?: keyof T;
  key?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  sorter?: boolean | ((a: T, b: T) => number);
  sortOrder?: 'ascend' | 'descend' | null;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  loading?: boolean;
  bordered?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  emptyText?: React.ReactNode;
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  scroll?: { x?: number | string; y?: number | string };
  sticky?: boolean;
}

export function Table<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  bordered = false,
  size = 'medium',
  className = '',
  emptyText,
  onRow,
  onChange,
  scroll,
  sticky = false
}: TableProps<T>) {
  const { t } = useTranslation();
  
  // 尺寸样式映射
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };
  
  // 边框样式
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // 获取行的唯一键
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] ?? index);
  };
  
  // 表格为空时的显示内容
  const renderEmpty = () => {
    return (
      <tr>
        <td colSpan={columns.length} className="text-center py-8">
          {emptyText || <Empty description={t('components.table.empty', 'No Data')} />}
        </td>
      </tr>
    );
  };
  
  // 加载状态
  const renderLoading = () => {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && renderLoading()}
      
      <div className={`overflow-x-auto ${scroll?.x ? 'overflow-x-scroll' : ''} ${scroll?.y ? 'overflow-y-scroll' : ''}`} style={{
        maxHeight: scroll?.y ? scroll.y : undefined,
        width: scroll?.x ? '100%' : undefined
      }}>
        <table className={`min-w-full divide-y divide-gray-200 ${borderClasses} ${sizeClasses[size]}`}>
          <thead className={`bg-gray-50 ${sticky ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key || columnIndex}
                  scope="col"
                  className={`px-6 py-3 text-${column.align || 'left'} font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataSource.length === 0 ? (
              renderEmpty()
            ) : (
              dataSource.map((record, index) => {
                const rowProps = onRow ? onRow(record, index) : {};
                
                return (
                  <tr key={getRowKey(record, index)} {...rowProps}>
                    {columns.map((column, columnIndex) => {
                      const value = column.dataIndex ? record[column.dataIndex] : undefined;
                      const cellContent = column.render
                        ? column.render(value, record, index)
                        : value;
                      
                      return (
                        <td
                          key={column.key || columnIndex}
                          className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'} ${column.className || ''}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 