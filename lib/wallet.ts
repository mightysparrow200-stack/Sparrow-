import { supabase } from '@/lib/supabase';

export interface WalletTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  created_at: string;
}

export async function getWalletData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { balance: 0, transactions: [] };

  // Fetch balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  // Fetch transactions
  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return {
    balance: wallet?.balance || 0,
    transactions: transactions || [],
  };
}
