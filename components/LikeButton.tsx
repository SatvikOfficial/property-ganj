'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { recordPropertyActivity } from '@/lib/recently-viewed';
import { createClient } from '@/utils/supabase/client';

interface LikeButtonProps {
  propertyId: string;
  initialLiked: boolean;
  className?: string;
  iconClassName?: string;
}

export default function LikeButton({
  propertyId,
  initialLiked,
  className,
  iconClassName,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bursting, setBursting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    if (!bursting) return undefined;
    const timeout = window.setTimeout(() => setBursting(false), 700);
    return () => window.clearTimeout(timeout);
  }, [bursting]);

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
      recordPropertyActivity(propertyId, newLikedState ? 'like' : 'other');

      if (newLikedState) {
        setBursting(false);
        window.setTimeout(() => setBursting(true), 0);
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
      type="button"
      onClick={handleLike}
      disabled={isSubmitting}
      aria-label={isLiked ? 'Remove from liked properties' : 'Add to liked properties'}
      aria-pressed={isLiked}
      className={cn(
        'relative isolate inline-flex items-center justify-center overflow-visible rounded-full border border-white/60 bg-white/86 p-2 text-current shadow-[0_16px_34px_-24px_rgba(31,42,46,0.42)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb6239]/35 disabled:cursor-not-allowed disabled:opacity-70',
        isLiked ? 'shadow-[0_12px_30px_-16px_rgba(235,70,102,0.75)]' : '',
        className,
      )}
    >
      {bursting ? (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#f39bb1] animate-[pg-heart-ring_700ms_ease-out]" />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <span
              key={index}
              className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[radial-gradient(circle,#ff8a7a_0%,#eb4666_72%)] animate-[pg-heart-particle_680ms_ease-out_forwards]"
              style={{ ['--particle-index' as string]: index } as CSSProperties}
            />
          ))}
        </>
      ) : null}
      <Heart
        className={cn(
          'h-6 w-6 transition-all duration-300 relative z-10',
          isLiked
            ? 'fill-[#eb4666] text-[#eb4666] drop-shadow-[0_8px_16px_rgba(235,70,102,0.35)]'
            : 'text-gray-500',
          bursting ? 'animate-[pg-heart-pop_520ms_cubic-bezier(0.22,1,0.36,1)]' : '',
          iconClassName,
        )}
      />
    </button>
  );
}
