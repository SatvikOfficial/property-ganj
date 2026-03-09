// MongoDB is being replaced by Supabase
// This file is kept temporarily to prevent import errors in legacy files

// Disable MongoDB connection during build/runtime
// All database operations should use Supabase instead

async function connectDB() {
  // Return null immediately without attempting any MongoDB connection
  // This prevents build errors when pages try to use legacy MongoDB code
  return null;
}

export default connectDB;

