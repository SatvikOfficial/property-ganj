# Property Ganj Real Estate Platform

This project is a modern real estate platform built with Next.js, Supabase, and Tailwind CSS. It replaces the legacy MongoDB backend with a scalable Supabase architecture.

## 🚀 Features

-   **Role-Based Authentication**: Secure login for Admin, Promoters, and Property Ganj Agents (PGA) using Supabase Auth.
-   **Admin Dashboard**: Comprehensive dashboard to manage projects, units, and agents.
-   **Real-time Inventory**: Live view of unit availability with instant updates (websocket).
-   **Soft & Hard Blocking**:
    -   **Soft Block**: Agents can hold a unit for 30 minutes. Auto-expiry logic.
    -   **Hard Block**: Admins/Promoters can permanently block a unit for a customer.
    -   **Sold**: Finalize the sale of a unit.
-   **Public Search**: (In Progress) Search for properties by city, project, or location.

## 🛠 Tech Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
-   **Backend**: Supabase (PostgreSQL, Auth, Realtime)
-   **State Management**: React Hooks + Supabase Realtime

## 📦 Prerequisites

-   Node.js 18+
-   Supabase Account

## ⚡️ Setup Guide

1.  **Clone the Repository**

    ```bash
    git clone <repository_url>
    cd property-ganj
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Migration**
    Run the SQL script provided in `supabase_schema.sql` in your Supabase SQL Editor. This will:
    -   Create necessary tables (`profiles`, `projects`, `towers`, `units`, etc.)
    -   Set up Row Level Security (RLS) policies.
    -   Create triggers for user registration.
    -   Populate initial enum types.

5.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Default Roles & Access

-   **Admin**: Full access to dashboard, user management, and hard blocking.
-   **Promoter**: Access to their specific projects and hard blocking.
-   **PGA (Agent)**: Can view inventory and Soft Block units (max 2 expiry-bound blocks).

## 📝 Usage

### Admin Dashboard
Access via `/admin/dashboard`. Requires a user with `role: 'admin'`.
-   **Overview**: Management summaries.
-   **Inventory**: Real-time table of all units.
    -   **Soft Block**: Click to reserve for 30 mins.
    -   **Hard Block**: Click requires remarks.
    -   **Mark Sold**: Finalizes the unit.

### Authentication
-   Sign up users via `/auth`.
-   **Note**: All new users default to `pga` role. An admin must manually update the `role` in the `profiles` table to upgrade a user to `admin` or `promoter`.

## 🤝 Contribution

1.  Fork the repo
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit changes (`git commit -m 'Add amazing feature'`)
4.  Push to branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
