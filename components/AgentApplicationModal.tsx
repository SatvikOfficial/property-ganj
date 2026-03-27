"use client";

import { useState } from "react";
import { CheckCircle2, Upload, X } from "lucide-react";

interface AgentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  user: any;
}

export default function AgentApplicationModal({ isOpen, onClose, onSubmit, user }: AgentApplicationModalProps) {
  const [formData, setFormData] = useState({
    bio: "",
    specialties: [] as string[],
    languages: [] as string[],
    experience: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const specialtyOptions = ["Residential Sales", "Commercial Spaces", "Land Development", "Investment Properties", "Luxury Properties", "Rental Properties", "Property Valuation", "First-time Buyers"];
  const languageOptions = ["English", "Hindi", "Urdu", "Punjabi", "Bengali", "Marathi", "Gujarati", "Tamil", "Telegu"];

  if (!isOpen) return null;

  const handleToggle = (field: 'specialties' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Typically upload to cloudinary/supabase here
      // Mocking local image for preview
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border relative flex flex-col max-h-[90vh]">
        <button
          onClick={() => {
            setIsSubmitted(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-muted hover:bg-muted/80 rounded-full transition"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="p-6 md:p-8 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Application submitted</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                We’ve received your request. Our team will review it and you’ll be upgraded to Agent after approval.
              </p>
              <div className="mt-7 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">Apply to become a Ganj Agent</h2>
              <p className="text-muted-foreground text-sm mb-6">Join our network of trusted real estate professionals in Lucknow.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Upload */}
              <div className="w-full md:w-1/3">
                <label className="text-sm font-semibold text-foreground mb-2 block">Profile Photo</label>
                <div className="relative aspect-square rounded-xl border-2 border-dashed border-border bg-accent/10 hover:bg-accent/20 transition flex flex-col items-center justify-center overflow-hidden cursor-pointer group">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="w-8 h-8 text-primary mx-auto mb-2 opacity-50 group-hover:opacity-100 transition" />
                      <span className="text-xs text-muted-foreground font-medium">Click to upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">Full Name</label>
                  <input type="text" value={user?.name || user?.full_name || ''} disabled className="w-full p-3 rounded-xl border border-border bg-muted text-muted-foreground text-sm" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">Years of Experience</label>
                  <input required type="number" min="0" placeholder="E.g. 5" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Professional Bio</label>
              <textarea required rows={4} placeholder="Describe your real estate background and what makes you a great agent..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
            </div>

            {/* Specialties */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Specialties (Select multiple)</label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map(spec => (
                  <button type="button" key={spec} onClick={() => handleToggle('specialties', spec)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${formData.specialties.includes(spec) ? 'bg-primary border-primary text-primary-foreground' : 'bg-transparent border-border text-muted-foreground hover:bg-accent/10'}`}>
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map(lang => (
                  <button type="button" key={lang} onClick={() => handleToggle('languages', lang)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${formData.languages.includes(lang) ? 'bg-secondary border-secondary text-secondary-foreground' : 'bg-transparent border-border text-muted-foreground hover:bg-accent/10'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition">Cancel</button>
              <button type="submit" disabled={isSubmitting || formData.specialties.length === 0} className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
            
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
