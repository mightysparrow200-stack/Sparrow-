import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import MemberDashboard from './components/MemberDashboard';
import VendorDashboard from './components/VendorDashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user from session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch linked Profile and Wallet data from Supabase
  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
  ]);

  // If user hasn't completed onboarding details, route them to finish setup
  if (!profile?.full_name) {
    redirect('/onboard/member');
  }

  // 3. Render dynamic dashboard based on user role
  if (profile?.role === 'vendor') {
    return <VendorDashboard user={user} profile={profile} />;
  }

  return <MemberDashboard user={user} profile={profile} wallet={wallet} />;
}
