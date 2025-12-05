"use client";

import React from 'react';
import styled from 'styled-components';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f6f5f1]">
      <StyledWrapper>
        <div className="spinner">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </StyledWrapper>

      <div className="mt-12 flex items-center gap-4 animate-fade-in">
        <img
          src="/assets/logo_1762856048370.jpg"
          alt="Property Ganj Logo"
          className="h-16 w-auto object-contain rounded-xl shadow-lg"
        />
        <img
          src="/assets/logotext_1762855981940.png"
          alt="Property Ganj Text"
          className="h-12 w-auto object-contain"
        />
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .spinner {
   width: 56px;
   height: 56px;
   animation: spinner-y0fdc1 2s infinite ease;
   transform-style: preserve-3d;
  }

  .spinner > div {
   background-color: rgba(235, 98, 57, 0.2);
   height: 100%;
   position: absolute;
   width: 100%;
   border: 2px solid #eb6239;
  }

  .spinner div:nth-of-type(1) {
   transform: translateZ(-28px) rotateY(180deg);
  }

  .spinner div:nth-of-type(2) {
   transform: rotateY(-270deg) translateX(50%);
   transform-origin: top right;
  }

  .spinner div:nth-of-type(3) {
   transform: rotateY(270deg) translateX(-50%);
   transform-origin: center left;
  }

  .spinner div:nth-of-type(4) {
   transform: rotateX(90deg) translateY(-50%);
   transform-origin: top center;
  }

  .spinner div:nth-of-type(5) {
   transform: rotateX(-90deg) translateY(50%);
   transform-origin: bottom center;
  }

  .spinner div:nth-of-type(6) {
   transform: translateZ(28px);
  }

  @keyframes spinner-y0fdc1 {
   0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
   }

   50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
   }

   100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
   }
  }`;

export default Preloader;