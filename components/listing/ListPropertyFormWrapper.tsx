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
    // Check if user is logged in
    if (!userData) {
      // Show toast prompting user to login
      toast({
        title: "Login Required",
        description: "You need to login or register to post your property listing. Please complete your property details first, then login to publish.",
      });

      // Save form data to localStorage
      try {
        localStorage.setItem('propertyFormData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }

      // Redirect to login after a delay to let the user see the toast
      setTimeout(() => {
        router.push('/auth');
      }, 3000); // 3 seconds delay

      return;
    }

    // If user is logged in, proceed with form submission
    try {
      // Submit the property listing to the server
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`,
        },
        body: JSON.stringify({
          ...formData,
          contact: {
            name: userData.name,
            phone: userData.phone,
            email: userData.email || formData.contact?.email,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit property');
      }

      // Success
      toast({
        title: "Property Listed!",
        description: "Your property has been successfully listed.",
      });

      // Remove saved form data
      localStorage.removeItem('propertyFormData');

      // Redirect to property detail or dashboard
      const result = await response.json();
      router.push(`/property/${result.property._id}`);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Could not submit property listing",
        variant: "destructive",
      });
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