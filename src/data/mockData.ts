export interface ONG {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  followers: number;
  logoUrl?: string;
}

export interface Post {
  id: string;
  ongId: string;
  ongName: string;
  category: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export const categories = [
  "Educação",
  "Saúde",
  "Meio Ambiente",
  "Animais",
  "Direitos Humanos",
  "Cultura",
  "Esporte",
  "Alimentação",
];

export const mockONGs: ONG[] = [
  {
    id: "1",
    name: "Verde Vivo",
    category: "Meio Ambiente",
    city: "São Paulo, SP",
    description:
      "Preservação de áreas verdes urbanas e educação ambiental para comunidades.",
    followers: 1240,
  },
  {
    id: "2",
    name: "Educação para Todos",
    category: "Educação",
    city: "Rio de Janeiro, RJ",
    description:
      "Acesso à educação de qualidade para crianças em situação de vulnerabilidade.",
    followers: 3450,
  },
  {
    id: "3",
    name: "Patas Amigas",
    category: "Animais",
    city: "Curitiba, PR",
    description: "Resgate e adoção responsável de animais abandonados.",
    followers: 2100,
  },
  {
    id: "4",
    name: "Saúde na Comunidade",
    category: "Saúde",
    city: "Belo Horizonte, MG",
    description: "Atendimento médico gratuito em comunidades carentes.",
    followers: 890,
  },
  {
    id: "5",
    name: "Cultura Viva Brasil",
    category: "Cultura",
    city: "Salvador, BA",
    description: "Promoção de cultura e arte em periferias urbanas.",
    followers: 1560,
  },
  {
    id: "6",
    name: "Direitos para Todos",
    category: "Direitos Humanos",
    city: "Brasília, DF",
    description: "Defesa dos direitos humanos e assistência jurídica gratuita.",
    followers: 2780,
  },
  {
    id: "7",
    name: "Esporte Cidadão",
    category: "Esporte",
    city: "Recife, PE",
    description: "Inclusão social através do esporte para jovens.",
    followers: 670,
  },
  {
    id: "8",
    name: "Mesa Cheia",
    category: "Alimentação",
    city: "Porto Alegre, RS",
    description: "Combate à fome e desperdício de alimentos.",
    followers: 4200,
  },
];

export const mockPosts: Post[] = [
  {
    id: "p1",
    ongId: "1",
    ongName: "Verde Vivo",
    category: "Meio Ambiente",
    content:
      "🌱 Plantamos mais de 500 árvores neste mês no Parque Municipal! Obrigado a todos os voluntários que participaram da ação.",
    likes: 87,
    comments: 12,
    createdAt: "2h atrás",
  },
  {
    id: "p2",
    ongId: "2",
    ongName: "Educação para Todos",
    category: "Educação",
    content:
      "📚 Novas vagas abertas para o programa de reforço escolar. Precisamos de voluntários para aulas de matemática e português!",
    likes: 134,
    comments: 28,
    createdAt: "4h atrás",
  },
  {
    id: "p3",
    ongId: "3",
    ongName: "Patas Amigas",
    category: "Animais",
    content:
      "🐾 Feira de adoção neste sábado! Venha conhecer nossos peludinhos que estão esperando um lar.",
    likes: 256,
    comments: 45,
    createdAt: "6h atrás",
  },
  {
    id: "p4",
    ongId: "8",
    ongName: "Mesa Cheia",
    category: "Alimentação",
    content:
      "🍽️ Distribuímos 2.000 marmitas esta semana. Cada doação faz diferença na vida de alguém.",
    likes: 312,
    comments: 56,
    createdAt: "8h atrás",
  },
  {
    id: "p5",
    ongId: "5",
    ongName: "Cultura Viva Brasil",
    category: "Cultura",
    content:
      "🎭 Inscrições abertas para oficina de teatro gratuita para jovens de 14 a 18 anos. Vagas limitadas!",
    likes: 78,
    comments: 15,
    createdAt: "1d atrás",
  },
];

export const currentUser = {
  type: "ong" as "ong" | "voluntario",
  ongId: "1",
  ongName: "Verde Vivo",
  category: "Meio Ambiente",
  name: "Administrador Verde Vivo",
  email: "contato@verdevivo.org",
};

export interface User {
  type: "ong" | "voluntario";
  name: string;
  email: string;
  ongId?: string;
  ongName?: string;
  category?: string;
}


