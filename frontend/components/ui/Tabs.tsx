import React, { useState, useEffect } from 'react';

interface TabPaneProps {
  tab: React.ReactNode;
  key: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabPane: React.FC<TabPaneProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

interface TabsProps {
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  children: React.ReactNode;
  type?: 'line' | 'card' | 'segment';
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
  tabBarClassName?: string;
  tabContentClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultActiveKey,
  activeKey: propActiveKey,
  onChange,
  children,
  type = 'line',
  size = 'md',
  centered = false,
  className = '',
  tabBarClassName = '',
  tabContentClassName = ''
}) => {
  const [activeKey, setActiveKey] = useState(propActiveKey || defaultActiveKey || '');
  
  // 当外部activeKey变化时更新内部状态
  useEffect(() => {
    if (propActiveKey !== undefined && propActiveKey !== activeKey) {
      setActiveKey(propActiveKey);
    }
  }, [propActiveKey]);
  
  // 处理标签点击
  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    
    const newActiveKey = key;
    if (!propActiveKey) {
      setActiveKey(newActiveKey);
    }
    
    onChange?.(newActiveKey);
  };
  
  // 获取所有TabPane子组件
  const panes = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child.type as any) === TabPane
  ) as React.ReactElement<TabPaneProps>[];
  
  // 如果没有设置activeKey，使用第一个非禁用标签
  useEffect(() => {
    if (!activeKey && panes.length > 0) {
      const firstNonDisabledKey = panes.find((pane) => !pane.props.disabled)?.props.key as string;
      if (firstNonDisabledKey) {
        handleTabClick(firstNonDisabledKey);
      }
    }
  }, []);
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // 类型样式映射
  const typeClasses = {
    line: {
      tabBar: 'border-b border-gray-200',
      tab: 'py-2 px-1 border-b-2 border-transparent',
      activeTab: 'border-blue-500 text-blue-600',
      inactiveTab: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    card: {
      tabBar: 'border-b border-gray-200',
      tab: 'py-2 px-4 border border-transparent rounded-t-md',
      activeTab: 'bg-white border-gray-200 border-b-white text-blue-600',
      inactiveTab: 'bg-gray-50 text-gray-500 hover:text-gray-700'
    },
    segment: {
      tabBar: 'bg-gray-100 p-1 rounded-md',
      tab: 'py-2 px-4 rounded-md',
      activeTab: 'bg-white shadow text-blue-600',
      inactiveTab: 'text-gray-500 hover:text-gray-700'
    }
  };
  
  return (
    <div className={className}>
      <div className={`${typeClasses[type].tabBar} ${tabBarClassName}`}>
        <nav className={`-mb-px flex ${centered ? 'justify-center' : 'space-x-8'} ${sizeClasses[size]}`}>
          {panes.map((pane) => {
            const key = pane.props.key as string;
            const isActive = key === activeKey;
            const isDisabled = pane.props.disabled;
            
            return (
              <button
                key={key}
                className={`${typeClasses[type].tab} ${
                  isActive
                    ? typeClasses[type].activeTab
                    : typeClasses[type].inactiveTab
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleTabClick(key, isDisabled)}
                role="tab"
                aria-selected={isActive}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
              >
                {pane.props.tab}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className={`mt-4 ${tabContentClassName}`}>
        {panes.map((pane) => {
          const key = pane.props.key as string;
          return (
            <div
              key={key}
              role="tabpanel"
              hidden={key !== activeKey}
              aria-hidden={key !== activeKey}
            >
              {key === activeKey && pane}
            </div>
          );
        })}
      </div>
    </div>
  );
};