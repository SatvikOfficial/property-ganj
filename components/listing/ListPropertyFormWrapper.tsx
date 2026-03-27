import ListPropertyForm from '@/components/listing/ListPropertyForm';

interface ListPropertyFormWrapperProps {
  userData: {
    name: string;
    phone: string;
    email?: string;
  } | null;
}

export default function ListPropertyFormWrapper({ userData }: ListPropertyFormWrapperProps) {
  return <ListPropertyForm user={userData} />;
}
