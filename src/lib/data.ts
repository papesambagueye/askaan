export type Campaign = { id: string; title: string; category: string; raised: number; goal: number; supporters: number; image: string; owner: string; status: "Publié" | "En attente" | "Refusé" };
export const campaigns: Campaign[] = [
  { id: "ecole-thies", title: "Une salle de classe pour l'école de Ndiassane", category: "Éducation", raised: 845000, goal: 1200000, supporters: 64, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80", owner: "Collectif Ndiassane", status: "Publié" },
  { id: "maman-fatou", title: "Aidons Maman Fatou à retrouver sa mobilité", category: "Santé", raised: 1675000, goal: 2000000, supporters: 121, image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80", owner: "Aminata Sarr", status: "Publié" },
  { id: "atelier-dakar", title: "Un atelier pour les jeunes de Grand-Yoff", category: "Emploi", raised: 320000, goal: 850000, supporters: 28, image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80", owner: "Keur Jeunesse", status: "Publié" },
  { id: "terrain-kolda", title: "Un terrain de sport pour Kolda", category: "Sport", raised: 0, goal: 950000, supporters: 0, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80", owner: "Association Espoir", status: "En attente" },
];
export const formatCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
export const percent = (raised: number, goal: number) => Math.min(100, Math.round((raised / goal) * 100));
