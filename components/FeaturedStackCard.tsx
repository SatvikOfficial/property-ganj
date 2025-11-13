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
      <div className="stack">
        <div className="card">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            {project.badge && (
              <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 font-semibold text-xs sm:text-sm">
                {project.badge}
              </div>
            )}
          </div>
          <div className="pt-2">
            <h3 className="font-bold text-foreground text-base sm:text-lg mb-1 truncate">{project.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{project.location}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">{project.type}</p>
            <p className="font-semibold text-foreground text-sm mb-1">{project.price}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">Marketed by {project.builder}</p>
            <Link href={`/property/${project.id}`}>
              <button className="w-full bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 transition-colors rounded text-xs sm:text-sm">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
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
    padding: 5% 5% 15% 5%;
    border-radius: 0.5rem;
    overflow: visible; /* Allow the frame to be visible */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: var(--border);
    background-color: rgba(214, 218, 220, 0.85); /* Apply the blue shade you specified */

    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      height: 100%;
      width: 105%;
      border: 4px solid;
      background-color: #fff;
      transform-origin: center center;
      z-index: -1;
      transition: 0.15s ease;
      top: 0;
      left: 0;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-color: var(--border);
      background-color: var(--card);
    }

    &:before {
      transform: translatey(-2%) rotate(-6deg);
    }

    &:after {
      transform: translatey(2\%) rotate(6deg);
    }
  }
  
  .image {
    width: 100%;
    border: 4px solid;
    background-color: #eee;
    aspect-ratio: 1 / 1;
    position: relative;
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