import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .menu {
    font-size: 16px;
    line-height: 1.6;
    color: #000000;
    width: fit-content;
    display: flex;
    list-style: none;
  }

  .menu a {
    text-decoration: none;
    color: #000000;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .menu .link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 36px;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu .link::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a3cff;
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu .link svg {
    width: 14px;
    height: 14px;
    fill: #000000;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu .link:hover {
    color: #ffffff;
  }

  .menu .link:hover svg {
    fill: #ffffff;
  }

  .menu .item {
    position: relative;
  }

  .menu .item .submenu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    position: absolute;
    top: 100%;
    border-radius: 0 0 16px 16px;
    left: 0;
    width: 800px; /* Standard width for 4 columns */
    overflow: hidden;
    border: 1px solid #cccccc;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    pointer-events: none;
    list-style: none;
    padding: 16px;
    background-color: #ffffff;
  }

  /* Make rent dropdown smaller but keep 4 columns */
  .menu[data-title="Rent"] .item .submenu {
    width: 850px;
  }

  /* Make sell dropdown smaller */
  .menu[data-title="Sell"] .item .submenu {
    width: 400px;
  }

  .menu .item:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
    border-top: transparent;
    border-color: #0a3cff;
  }

  .menu .item:hover .link {
    color: #ffffff;
    border-radius: 16px 16px 0 0;
    z-index: 2; /* Ensure it appears above the submenu */
  }

  .menu .item:hover .link::after {
    transform: scaleX(1);
    transform-origin: right;
  }

  .menu .item:hover .link svg {
    fill: #ffffff;
    transform: rotate(-180deg);
  }

  .submenu-section h3 {
    font-weight: bold;
    color: #000000;
    margin-bottom: 12px;
    font-size: 0.875rem; /* text-sm */
  }

  .submenu-item {
    width: 100%;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .submenu-link {
    display: block;
    padding: 6px 8px;
    width: 100%;
    position: relative;
    text-align: left;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    color: #555555;
    font-size: 0.75rem; /* text-xs to save space */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .submenu-link::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0);
    width: 100%;
    height: 100%;
    background-color: #0a3cff;
    z-index: -1;
    transform-origin: left;
    transition: transform 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .submenu-link:hover::before {
    transform: scaleX(1);
    transform-origin: right;
  }

  .submenu-link:hover {
    color: #ffffff;
  }
  
  .submenu-link .free-badge {
    background-color: #f97316; /* orange-500 */
    color: white;
    padding: 2px 6px;
    border-radius: 9999px;
    font-size: 0.75rem; /* text-xs */
    font-weight: bold;
    margin-left: 4px;
  }
`;

interface StyledDropdownProps {
  title: string;
  sections: {
    title: string;
    items: { href: string; label: string }[];
  }[];
}

const StyledDropdown: React.FC<StyledDropdownProps> = ({ title, sections }) => {
  return (
    <StyledWrapper>
      <div className="menu" data-title={title}>
        <div className="item">
          <a href="#" className="link" onClick={(e) => e.preventDefault()}>
            <span>{title}</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <div className="submenu">
            {sections.map((section, index) => (
              <div className="submenu-section" key={index}>
                <h3>{section.title}</h3>
                <div className="submenu-items">
                  {section.items.map((item, itemIndex) => (
                    <div className="submenu-item" key={itemIndex}>
                      <a href={item.href} className="submenu-link">
                        {item.label.includes('FREE') ? (
                          <>
                            {item.label.split('FREE')[0]}
                            <span className="free-badge">FREE</span>
                            {item.label.split('FREE')[1]}
                          </>
                        ) : item.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default StyledDropdown;