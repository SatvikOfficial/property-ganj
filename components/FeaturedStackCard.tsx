import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import CustomViewDetailsButton from '@/components/CustomViewDetailsButton';

interface FeaturedProject {
  id: number;
  name: string;
  location: string;
  type: string;
  price: string;
  builder: string;
  image: string;
  badge?: string;
}

interface FeaturedStackCardProps {
  project: FeaturedProject;
}

const Card: React.FC<FeaturedStackCardProps> = ({ project }) => {
  return (
    <StyledWrapper>
      <div>
        <p className="browser-warning">
          If this looks wonky to you it's because this browser doesn't support the CSS
          property 'aspect-ratio'.
        </p>
        <div className="stack">
          <div className="card">
            {/* Position the badge above the image */}
            {project.badge && (
              <div className="offer-badge mb-2 w-max mx-auto bg-accent text-accent-foreground text-center py-1 px-2 font-semibold text-[10px] max-w-[80%]">
                {project.badge}
              </div>
            )}
            
            {/* Main image area */}
            <div className="image-section">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="content-section pt-2 text-center">
              <h3 className="font-bold text-foreground text-lg sm:text-xl mb-1">{project.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-1">{project.location}</p>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">{project.type}</p>
              <p className="font-semibold text-foreground text-base sm:text-lg mb-1">{project.price}</p>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">Marketed by {project.builder}</p>
              <Link href={`/property/${project.id}`}>
                <CustomViewDetailsButton />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  img {
    display: block;
    max-width: 100%;
  }

  .stack {
    
    transition: 0.25s ease;
    &:hover {
      transform: rotate(5deg);
      .card:before {
        transform: translatey(-2%) rotate(-4deg);
      }
      .card:after {
        transform: translatey(2%) rotate(4deg);
      }
    }
  }

  .card {
    aspect-ratio: 3 / 2;
    border: 4px solid;
    background-color: #fff;
    position: relative;
    transition: 0.15s ease;
    cursor: pointer;
    padding: 8% 8% 20% 8%;
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      border: 4px solid;
      background-color: #fff;
      transform-origin: center center;
      z-index: -1;
      transition: 0.15s ease;
      top: 0;
      left: 0;
    }

    &:before {
      transform: translatey(-2%) rotate(-6deg);
    }

    &:after {
      transform: translatey(2%) rotate(6deg);
    }
  }
  
  .image-section {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
    border: 4px solid;
    border-radius: 0.25rem;
  }
  
  .content-section {
    position: relative;
  }
  
  .offer-badge {
    z-index: 10; /* Make sure it appears above other elements */
  }

  .browser-warning {
    margin-bottom: 4rem;
  }

  @supports (aspect-ratio: 1 / 1) {
    .browser-warning {
      display: none;
    }
  }`;

export default Card;