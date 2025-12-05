'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Calculator,
    HandCoins,
    Home,
    Percent,
    CheckCircle,
    ArrowRight,
    Phone,
    MapPin,
    ShieldCheck,
    Users,
    Building2,
    Banknote,
    Clock,
    Plane,
    Gift,
    Stethoscope
} from 'lucide-react';

export default function HomeLoanPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pincode: '',
        address: '',
        loanAmount: '',
        agree: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // EMI Calculator State
    const [emiAmount, setEmiAmount] = useState(2500000);
    const [emiTenure, setEmiTenure] = useState(20);
    const [emiRate, setEmiRate] = useState(8.5);
    const [calculatedEmi, setCalculatedEmi] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    useEffect(() => {
        const r = emiRate / 12 / 100;
        const n = emiTenure * 12;
        const emi = (emiAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setCalculatedEmi(Math.round(emi));
        setTotalAmount(Math.round(emi * n));
        setTotalInterest(Math.round((emi * n) - emiAmount));
    }, [emiAmount, emiTenure, emiRate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agree) {
            setError('Please agree to the Terms and Conditions');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, you would send this to your backend
            // const res = await fetch('/api/loan/apply', { ... });

            setSuccess(true);
            setFormData({
                name: '',
                phone: '',
                pincode: '',
                address: '',
                loanAmount: '',
                agree: false
            });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            {/* Hero Section */}
            <div id="hero-section" className="relative bg-background text-foreground overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10"></div>
                    {/* Use a subtle gradient or pattern instead of the image if desired, or keep image with better blending */}
                    <img
                        src="/modern-apartment.jpg"
                        alt="Home Loan Background"
                        className="w-full h-full object-cover opacity-10"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                                Get Home Loans <br />
                                <span className="text-primary">Starting At 7.75% P.A.*</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                With Loan Amount From ₹15 Lacs*. We partner with top banks to get you the best deal.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary uppercase tracking-wider">Key Benefits</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                                    {[
                                        "Attractive Interest Rates",
                                        "Loan Tenure Up To 30 Years*",
                                        "Quick & Transparent Processing",
                                        "Nil Pre-Payment Charges*",
                                        "Balance Transfer Available",
                                        "Doorstep Services"
                                    ].map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-xs text-muted-foreground">*T&C Applied. For floating rate home loans given to individuals.</p>
                        </div>

                        {/* Lead Form */}
                        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 text-card-foreground border border-border">
                            <h3 className="text-2xl font-bold mb-6 text-foreground">Get Home Loan</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <div className="flex gap-2">
                                    <span className="px-4 py-3 bg-muted border border-input rounded-lg text-muted-foreground font-medium">+91</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter Current Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <input
                                    type="number"
                                    name="loanAmount"
                                    placeholder="Required Loan Amount (₹)"
                                    value={formData.loanAmount}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />

                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="agree"
                                        checked={formData.agree}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 text-primary rounded border-input focus:ring-primary"
                                    />
                                    <span className="text-sm text-muted-foreground">I agree to the Terms and Conditions and authorize Property Ganj to contact me.</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-primary/30"
                                >
                                    {loading ? 'Submitting...' : 'Apply Now'}
                                </button>

                                {success && (
                                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center text-sm font-medium border border-green-200">
                                        Application submitted successfully! We will contact you shortly.
                                    </div>
                                )}
                                {error && (
                                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-center text-sm font-medium border border-destructive/20">
                                        {error}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-background py-12 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Happy Customers", value: "91,200", icon: Users },
                            { label: "Loans Disbursed", value: "₹ 55,000+ Cr", icon: Banknote },
                            { label: "Pin Codes Covered", value: "8,100+", icon: MapPin },
                            { label: "AUM (Cr)", value: "31,053", icon: Building2 },
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* EMI Calculator Section */}
            <div className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground">Home Loan EMI Calculator</h2>
                        <p className="mt-2 text-muted-foreground">Plan your finances with our easy-to-use calculator</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-border">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                {/* Loan Amount Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="font-semibold text-foreground">Loan Amount</label>
                                        <div className="bg-primary/10 px-4 py-1 rounded-full text-primary font-bold">
                                            {formatCurrency(emiAmount)}
                                        </div>
                                    </div>
                                    <Slider
                                        defaultValue={[emiAmount]}
                                        max={12000000}
                                        min={100000}
                                        step={100000}
                                        onValueChange={(val) => setEmiAmount(val[0])}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>₹ 1L</span>
                                        <span>₹ 1.2Cr</span>
                                    </div>
                                </div>

                                {/* Tenure Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="font-semibold text-foreground">Tenure (Years)</label>
                                        <div className="bg-primary/10 px-4 py-1 rounded-full text-primary font-bold">
                                            {emiTenure} Years
                                        </div>
                                    </div>
                                    <Slider
                                        defaultValue={[emiTenure]}
                                        max={30}
                                        min={1}
                                        step={1}
                                        onValueChange={(val) => setEmiTenure(val[0])}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>1 Year</span>
                                        <span>30 Years</span>
                                    </div>
                                </div>

                                {/* Interest Rate Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="font-semibold text-foreground">Interest Rate (% P.A.)</label>
                                        <div className="bg-primary/10 px-4 py-1 rounded-full text-primary font-bold">
                                            {emiRate}%
                                        </div>
                                    </div>
                                    <Slider
                                        defaultValue={[emiRate]}
                                        max={15}
                                        min={7}
                                        step={0.1}
                                        onValueChange={(val) => setEmiRate(val[0])}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>7%</span>
                                        <span>15%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="bg-gray-900 rounded-xl p-8 text-white flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-1">Monthly EMI</p>
                                    <p className="text-4xl font-bold text-secondary">{formatCurrency(calculatedEmi)}</p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Principal Amount</span>
                                        <span className="font-semibold">{formatCurrency(emiAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Interest</span>
                                        <span className="font-semibold text-primary">{formatCurrency(totalInterest)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                        <span className="text-gray-300 font-medium">Total Amount Payable</span>
                                        <span className="font-bold text-xl">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-colors text-primary-foreground">
                                    Apply for this Loan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Section */}
            <div className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
                            Transparent and hassle-free plans
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Pragati Home Loan",
                                icon: Home,
                                features: [
                                    "Loans from ₹5 Lakhs to ₹1 Crore",
                                    "Loans against a variety of collaterals",
                                    "Repayment Tenure of up to 30* years",
                                    "Loan up to 90% of property market value"
                                ]
                            },
                            {
                                title: "Pragati Plus",
                                icon: CheckCircle,
                                features: [
                                    "Loan up to ₹1.5 Crores",
                                    "Loan up to 75%* of property value for self-employed",
                                    "Loan up to 80%* of property value for salaried",
                                    "Wide array of eligibility solutions"
                                ]
                            },
                            {
                                title: "Balance Transfer & Top-Ups",
                                icon: Percent,
                                features: [
                                    "Higher eligibility based on Repayment Track Record",
                                    "Up to 30% top-up available",
                                    "Quick processing",
                                    "Comfortable repayment tenure up to 30 years"
                                ]
                            }
                        ].map((plan, idx) => (
                            <div key={idx} className="bg-card rounded-2xl p-8 hover:shadow-xl transition-shadow border border-border">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <plan.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4">{plan.title}</h3>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2 text-muted-foreground text-sm">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Offers Section */}
            <div className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">Top offers handpicked by many like you</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Step Up",
                                desc: "Landed your first job? Set your hefty EMI worries aside and start small with a Step Up Home Loan.",
                                icon: ArrowRight
                            },
                            {
                                title: "Step Down",
                                desc: "Ease your debt burden with a Step Down loan. Pay higher EMIs now, and transition to lower EMIs after you retire.",
                                icon: ArrowRight
                            },
                            {
                                title: "Extended Tenure",
                                desc: "Enjoy the flexibility of a repayment term of up to 25* years and enhance your eligibility by including a working co-applicant.",
                                icon: Clock
                            }
                        ].map((offer, idx) => (
                            <div key={idx} className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors border border-gray-700">
                                <h3 className="text-xl font-bold mb-4 text-primary">{offer.title}</h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">{offer.desc}</p>
                                <button className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all" onClick={() => document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Know More <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-16 bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-16">
                        Get a home loan in 5 easy steps
                    </h2>
                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                            {[
                                { title: "Share Details", desc: "Share your personal details" },
                                { title: "Call Back", desc: "Get a call back from our team" },
                                { title: "Disclose", desc: "Disclose required details" },
                                { title: "Documents", desc: "Share documents with us" },
                                { title: "Get Loan", desc: "Get your Home Loan" },
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center bg-card p-6 rounded-xl shadow-sm md:bg-transparent md:shadow-none md:p-0">
                                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 shadow-lg ring-4 ring-primary/10">
                                        {idx + 1}
                                    </div>
                                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Club Section */}
            <div className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Signature Club</h2>
                            <p className="text-gray-400 mb-8">Exclusive offers available in select cities*</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { title: "25% Discount on modular solutions", icon: Home, code: "FLAT10" },
                                    { title: "Curated health care packages", icon: Stethoscope, code: "FLAT10" },
                                    { title: "Offers on Flights & Hotels", icon: Plane, code: "FLAT10" },
                                    { title: "Benefits worth ₹2999 at ₹299", icon: Gift, code: "FLAT10" },
                                ].map((offer, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                                        <offer.icon className="w-8 h-8 text-primary mb-4" />
                                        <p className="font-medium mb-4 min-h-[3rem]">{offer.title}</p>
                                        <div className="bg-black/30 rounded-lg p-2 text-center text-sm font-mono text-red-300 border border-dashed border-red-900/50">
                                            Code: {offer.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 bg-muted/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-12">Got Questions? We've Got Answers!</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            {
                                q: "What is a Home Loan?",
                                a: "A home loan is a type of a secured loan that is availed by a user from financial institutions to purchase a house. A house loan is repaid by paying regular equated monthly installments (EMI) which includes of a part of the principal taken as a loan and the interest accrued."
                            },
                            {
                                q: "What is the maximum home loan that I can get?",
                                a: "The maximum loan amount depends on your income, credit score, and the property value. Generally, banks offer up to 80-90% of the property's market value."
                            },
                            {
                                q: "Do I get tax benefits on housing loan?",
                                a: "Yes, you can claim tax deductions on both the principal repayment (under Section 80C) and interest payment (under Section 24b) of your home loan."
                            },
                            {
                                q: "Can I get approval for home loan without finalizing on my property?",
                                a: "Yes, you can get a pre-approved home loan based on your income and creditworthiness, which is valid for a specific period (usually 3-6 months)."
                            }
                        ].map((faq, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="bg-card rounded-lg border border-border px-4">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-4">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-4">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <div className="text-center mt-8">
                        <button className="text-primary font-semibold hover:underline" onClick={() => alert('More FAQs coming soon!')}>Load more FAQs</button>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Matluf Raza",
                                location: "Jaipur",
                                text: "Property Ganj provided fast service. I am so happy and glad. The staff is too good. The sales representative supported me throughout the process of my home loan. Thank you so much Property Ganj team.",
                                initial: "M",
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                name: "Akkim Sait A",
                                location: "Tiruchirappalli",
                                text: "I am very glad to share the experience with Property Ganj.. Its my first experience in loan process with them.. I am very happy with the processing and documentation process.. It is very ease for me to complete the process of home loan..",
                                initial: "A",
                                color: "bg-green-100 text-green-600"
                            },
                            {
                                name: "Sivaraj M",
                                location: "Coimbatore",
                                text: "I appreciate the efficient services provided by Property Ganj. The staff is knowledgeable, each process was managed well and transactions are consistently smooth, making it a hassle-free experience.",
                                initial: "S",
                                color: "bg-purple-100 text-purple-600"
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-card rounded-2xl p-8 relative border border-border">
                                <div className="absolute -top-4 left-8">
                                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-xl border-4 border-card shadow-sm`}>
                                        {testimonial.initial}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-muted-foreground italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                                    <div>
                                        <p className="font-bold text-foreground">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
