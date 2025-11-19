'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  propertyId: string;
  initialLiked: boolean;
}

export default function LikeButton({ propertyId, initialLiked }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      toast({
        title: newLikedState ? 'Property Liked (Simulation)' : 'Property Unliked (Simulation)',
        description: "This is a frontend-only action.",
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isSubmitting}
      className="absolute top-2 right-2 z-10 p-2 bg-white/70 rounded-full hover:bg-white transition-all duration-200"
    >
      <Heart
        className={cn(
          'w-6 h-6 transition-all duration-300',
          isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'
        )}
      />
    </button>
  );
}
