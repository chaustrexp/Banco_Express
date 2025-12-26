import React from 'react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className={`flex items-center gap-2 ${item.active ? 'text-primary-600 dark:text-primary-400 font-medium' : ''}`}>
            {item.icon && <i className={`${item.icon} text-xs`}></i>}
            <span>{item.label}</span>
          </div>
          {index < items.length - 1 && (
            <i className="fas fa-chevron-right text-xs text-gray-400"></i>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;