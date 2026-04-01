import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import CustomViewDetailsButton from '@/components/CustomViewDetailsButton';
import LikeButton from '@/components/LikeButton';

interface FeaturedProject {
  id: number | string;
  name: string;
  location: string;
  type: string;
  price: string;
  builder: string;
  image: string;
  badge?: string;
  isLiked?: boolean;
}

interface FeaturedStackCardProps {
  project: FeaturedProject;
}

const Card: React.FC<FeaturedStackCardProps> = ({ project }) => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* Image */}
        <div className="image-section">
          <LikeButton
            propertyId={project.id.toString()}
            initialLiked={project.isLiked || false}
            className="absolute right-3 top-3 z-20"
          />
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="content-section">
          <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 line-clamp-2">{project.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{project.location}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{project.type}</p>
          <p className="font-semibold text-foreground text-sm sm:text-base mb-1">{project.price}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">{project.builder}</p>
          <Link href={`/property/${project.id.toString().startsWith('placeholder-') ? `placeholder/${project.id}` : project.id}`}>
            <CustomViewDetailsButton />
          </Link>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 220px;
    height: 280px;
    background: #07182E;
    position: relative;
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 16px;
    padding: 8px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    box-shadow: 0 24px 48px -34px rgba(7, 24, 46, 0.7);
  }

  @media (min-width: 768px) {
    .card {
      width: 380px;
      height: 450px;
      border-radius: 20px;
      padding: 12px;
    }
  }

  .card::before {
    content: '';
    position: absolute;
    width: 70px;
    background-image: linear-gradient(180deg, oklch(0.659 0.18 36.25), oklch(0.671 0.11 228.44));
    height: 130%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
  }

  @media (min-width: 768px) {
    .card::before {
      width: 100px;
    }
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: '';
    position: absolute;
    background: #FFF;
    inset: 2px;
    border-radius: 12px;
    z-index: 0;
  }

  @media (min-width: 768px) {
    .card::after {
      inset: 3px;
      border-radius: 15px;
    }
  }

  .card:hover:before {
    background-image: linear-gradient(180deg, oklch(0.659 0.18 36.25), oklch(0.659 0.18 36.25));
    animation: rotBGimg 3.5s linear infinite;
  }

  .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 60px -32px rgba(7, 24, 46, 0.55);
  }

  .image-section {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 6px;
    margin-bottom: 6px;
    z-index: 1;
    height: 130px;
  }

  .image-section img {
    transition: transform 0.55s ease;
  }

  .card:hover .image-section img {
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    .image-section {
      border-radius: 8px;
      margin-bottom: 8px;
      height: 200px;
    }
  }

  .content-section {
    position: relative;
    z-index: 1;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-section h3,
  .content-section p {
    color: #1f2a2e;
  }
`;

export default Card;
