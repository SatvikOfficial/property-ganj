'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

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

  const supabase = createClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Please login', description: 'You must be logged in to like properties.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      const newLikedState = !isLiked;
      setIsLiked(newLikedState); // optimistic UI update

      if (newLikedState) {
        const { error } = await supabase.from('likes').insert({ property_id: propertyId, user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('likes')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);
        if (error) throw error;
      }

    } catch (error) {
      setIsLiked(isLiked); // revert on failure
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
