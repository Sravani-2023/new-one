import React from 'react';
import useBreadcrumb from './useBreadCrumb.hooks'
import BreadcrumbCollapser from './BreadCrumbCollapser.component'

const BreadcrumbItem = ({ children, ...props }) => (
    <li className='breadcrumb-item' {...props}>
      {children}
    </li>
  );

const Breadcrumb = ({ separator, collapse = {}, ...props }) => {
    let children = React.Children.toArray(props.children);
  
    const { expanded, open } = useBreadcrumb();
  
    const { itemsBefore = 1, itemsAfter = 1, max = 4 } = collapse;
  
    const totalItems = children.length;
    const lastIndex = totalItems - 1;
  
    children = children.map((child, index) => (
      <BreadcrumbItem key={`breadcrumb_item${index}`}>{child}</BreadcrumbItem>
    ));
  
    return <ol className="breadcrumb">{children}</ol>
  }
  
  export default Breadcrumb