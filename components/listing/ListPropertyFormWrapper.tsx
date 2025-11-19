'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ListPropertyForm from '@/components/listing/ListPropertyForm';

interface ListPropertyFormWrapperProps {
  userData: {
    name: string;
    phone: string;
    email?: string;
  } | null;
}

export default function ListPropertyFormWrapper({ userData }: ListPropertyFormWrapperProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved form data from localStorage on client side
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('propertyFormData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (formData: any) => {
    // Simulate submission
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Success
      toast({
        title: "Property Listed! (Simulation)",
        description: "Your property has been successfully listed on the frontend.",
      });

      // Remove saved form data
      localStorage.removeItem('propertyFormData');

      // Redirect to home page
      router.push(`/`);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Could not submit property listing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading property form...</div>;
  }

  return (
    <ListPropertyForm
      user={userData}
      initialFormData={formData}
      onSubmit={handleSubmit}
    />
  );
}