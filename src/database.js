import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getEleves = async () => {
  const { data, error } = await supabase
    .from('eleves')
    .select('*')
    .order('nom, prenom');
  
  if (error) throw error;
  return data;
};

export const ajouterEleve = async (nom, prenom, date_naissance) => {
  const { error } = await supabase
    .from('eleves')
    .insert([{ nom, prenom, date_naissance }]);
  
  if (error) throw error;
};

export const supprimerEleve = async (id) => {
  const { error } = await supabase
    .from('eleves')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const verifierMotDePasse = async (password) => {
  const { data, error } = await supabase
    .from('admin_password')
    .select('password')
    .limit(1)
    .single();
  
  if (error) throw error;
  return password === data.password;
};

export const changerMotDePasse = async (newPassword) => {
  const { error } = await supabase
    .from('admin_password')
    .update({ password: newPassword })
    .eq('id', 1);
  
  if (error) throw error;
};