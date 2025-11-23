import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanApplication from '@/models/LoanApplication';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, phone, loanAmount, city } = body;

        if (!name || !phone || !loanAmount || !city) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const application = await LoanApplication.create({
            name,
            phone,
            loanAmount,
            city,
        });

        return NextResponse.json(
            {
                message: 'Application submitted successfully',
                application,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Loan application error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
