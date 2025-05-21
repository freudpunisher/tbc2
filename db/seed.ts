import { db } from "./index"
import {
  products,
  carouselImages,
  teamMembers,
  milestones,
  companyValues,
  contactInfo,
  faqItems,
  aboutContent,
  categories,
  brands,
} from "./schema"

async function seed() {
  console.log("🌱 Seeding database...")
  console.log("Cleaning existing data...")
  await db.delete(categories)
  await db.delete(brands)
  await db.delete(products)
  await db.delete(carouselImages)
  await db.delete(teamMembers)
  await db.delete(milestones)
  await db.delete(companyValues)
  await db.delete(contactInfo)
  await db.delete(faqItems)
  await db.delete(aboutContent)
  // Seed categories
  console.log("Seeding categories...")
  await db.insert(categories).values([
    { name: "Électronique", description: "Produits électroniques et gadgets" },
    { name: "Vêtements", description: "Vêtements et accessoires" },
    { name: "Maison", description: "Articles pour la maison et le jardin" },
    { name: "Alimentation", description: "Produits alimentaires" },
  ])

  // Seed brands
  console.log("Seeding brands...")
  await db.insert(brands).values([
    { name: "Marque 1", description: "Description de la marque 1" },
    { name: "Marque 2", description: "Description de la marque 2" },
    { name: "Marque 3", description: "Description de la marque 3" },
  ])

  // Seed products
  console.log("Seeding products...")
  await db.insert(products).values([
    {
      name: "Produit Populaire 1",
      price: "99.99",
      category: "Électronique",
      brand: "Marque 1",
      image: "/placeholder.svg?height=300&width=400",
      isBestseller: true,
    },
    {
      name: "Produit Populaire 2",
      price: "149.99",
      category: "Maison",
      brand: "Marque 2",
      image: "/placeholder.svg?height=300&width=400",
      isBestseller: true,
    },
    {
      name: "Produit Populaire 3",
      price: "79.99",
      category: "Vêtements",
      brand: "Marque 3",
      image: "/placeholder.svg?height=300&width=400",
      isBestseller: true,
    },
    {
      name: "Produit Populaire 4",
      price: "129.99",
      category: "Alimentation",
      brand: "Marque 1",
      image: "/placeholder.svg?height=300&width=400",
      isBestseller: true,
    },
    {
      name: "Nouveau Produit 1",
      price: "129.99",
      category: "Électronique",
      brand: "Marque 2",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
    },
    {
      name: "Nouveau Produit 2",
      price: "89.99",
      category: "Maison",
      brand: "Marque 3",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
    },
    {
      name: "Nouveau Produit 3",
      price: "199.99",
      category: "Vêtements",
      brand: "Marque 1",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
    },
    {
      name: "Nouveau Produit 4",
      price: "59.99",
      category: "Alimentation",
      brand: "Marque 2",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
    },
  ])

  // Seed carousel images
  console.log("Seeding carousel images...")
  await db.insert(carouselImages).values([
    {
      title: "TANGANYIKA BUSINESS COMPANY",
      subtitle: "Votre partenaire commercial de confiance au Burundi",
      imageUrl: "/placeholder.svg?height=600&width=1200",
      order: 1,
    },
    {
      title: "Découvrez nos produits",
      subtitle: "Une large gamme de produits de qualité",
      imageUrl: "/placeholder.svg?height=600&width=1200",
      order: 2,
    },
    {
      title: "Service client exceptionnel",
      subtitle: "Nous sommes à votre écoute",
      imageUrl: "/placeholder.svg?height=600&width=1200",
      order: 3,
    },
  ])

  // Seed team members
  console.log("Seeding team members...")
  await db.insert(teamMembers).values([
    {
      name: "Jean Ndayishimiye",
      position: "Fondateur & PDG",
      bio: "Visionnaire et leader, Jean a fondé l'entreprise avec la mission de transformer le commerce au Burundi.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      order: 1,
    },
    {
      name: "Marie Niyonzima",
      position: "Directrice des Opérations",
      bio: "Avec 15 ans d'expérience, Marie supervise toutes les opérations quotidiennes de l'entreprise.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      order: 2,
    },
    {
      name: "Pierre Hakizimana",
      position: "Directeur Commercial",
      bio: "Pierre dirige notre équipe commerciale et développe nos relations avec les fournisseurs internationaux.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      order: 3,
    },
    {
      name: "Claire Uwimana",
      position: "Responsable Marketing",
      bio: "Claire apporte sa créativité et son expertise pour faire connaître nos produits dans tout le pays.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      order: 4,
    },
  ])

  // Seed milestones
  console.log("Seeding milestones...")
  await db.insert(milestones).values([
    {
      year: "2008",
      title: "Fondation de l'entreprise",
      description: "Tanganyika Business Company est fondée à Bujumbura avec une petite équipe de 5 personnes.",
      order: 1,
    },
    {
      year: "2012",
      title: "Expansion régionale",
      description: "Ouverture de notre premier bureau régional à Gitega et expansion de notre réseau de distribution.",
      order: 2,
    },
    {
      year: "2016",
      title: "Partenariats internationaux",
      description: "Signature de partenariats stratégiques avec des fournisseurs internationaux majeurs.",
      order: 3,
    },
    {
      year: "2020",
      title: "Lancement de notre plateforme en ligne",
      description: "Digitalisation de nos services avec le lancement de notre site web et de notre boutique en ligne.",
      order: 4,
    },
    {
      year: "2023",
      title: "Célébration de notre 15ème anniversaire",
      description: "15 ans d'excellence, avec plus de 50 employés et une présence dans tout le Burundi.",
      order: 5,
    },
  ])

  // Seed company values
  console.log("Seeding company values...")
  await db.insert(companyValues).values([
    {
      title: "Qualité",
      description: "Nous nous engageons à fournir uniquement des produits de la plus haute qualité à nos clients.",
      icon: "CheckCircle",
      order: 1,
    },
    {
      title: "Intégrité",
      description: "Nous menons nos affaires avec honnêteté, transparence et respect pour tous nos partenaires.",
      icon: "Users",
      order: 2,
    },
    {
      title: "Innovation",
      description: "Nous recherchons constamment de nouveaux produits et solutions pour mieux servir nos clients.",
      icon: "TrendingUp",
      order: 3,
    },
    {
      title: "Excellence",
      description:
        "Nous visons l'excellence dans tous les aspects de notre entreprise, du service client à la logistique.",
      icon: "Award",
      order: 4,
    },
  ])

  // Seed contact info
  console.log("Seeding contact info...")
  await db.insert(contactInfo).values([
    {
      type: "address",
      value: "123 Avenue Principale, Bujumbura, Burundi",
      icon: "MapPin",
      order: 1,
    },
    {
      type: "email",
      value: "info@tanganyikabusinesscompany.bi\nsupport@tanganyikabusinesscompany.bi",
      icon: "Mail",
      order: 2,
    },
    {
      type: "phone",
      value: "+257 12 345 678\n+257 98 765 432",
      icon: "Phone",
      order: 3,
    },
    {
      type: "hours",
      value: "Lundi - Vendredi: 8h00 - 18h00\nSamedi: 9h00 - 15h00",
      icon: "Clock",
      order: 4,
    },
  ])

  // Seed FAQ items
  console.log("Seeding FAQ items...")
  await db.insert(faqItems).values([
    {
      question: "Quels sont vos délais de livraison?",
      answer:
        "Nos délais de livraison varient en fonction de votre localisation. En général, nous livrons à Bujumbura sous 24-48h et dans les autres régions du Burundi sous 2-5 jours ouvrables.",
      category: "livraison",
      order: 1,
    },
    {
      question: "Acceptez-vous les retours de produits?",
      answer:
        "Oui, nous acceptons les retours dans les 14 jours suivant la réception du produit, à condition qu'il soit dans son état d'origine. Veuillez nous contacter avant de retourner un article.",
      category: "retours",
      order: 2,
    },
    {
      question: "Quels modes de paiement acceptez-vous?",
      answer:
        "Nous acceptons les paiements par carte bancaire, mobile money (M-Pesa, Airtel Money), et en espèces à la livraison pour les commandes à Bujumbura.",
      category: "paiement",
      order: 3,
    },
    {
      question: "Proposez-vous des services d'installation?",
      answer:
        "Oui, pour certains produits comme les équipements électroniques et les meubles, nous proposons des services d'installation moyennant des frais supplémentaires.",
      category: "services",
      order: 4,
    },
  ])

  // Seed about content
  console.log("Seeding about content...")
  await db.insert(aboutContent).values([
    {
      section: "hero",
      title: "À Propos de Nous",
      content:
        "Découvrez l'histoire, les valeurs et la mission de Tanganyika Business Company, votre partenaire commercial de confiance au Burundi depuis plus de 15 ans.",
      imageUrl: "/placeholder.svg?height=600&width=1200",
    },
    {
      section: "story",
      title: "Notre Histoire",
      content:
        "Fondée en 2008, Tanganyika Business Company a débuté comme une petite entreprise familiale à Bujumbura. Notre fondateur, Jean Ndayishimiye, avait une vision claire : créer une entreprise qui servirait de pont entre les produits de qualité internationale et les consommateurs burundais.",
    },
    {
      section: "why-choose-us",
      title: "Pourquoi Nous Choisir",
      content:
        "Découvrez ce qui fait de Tanganyika Business Company le partenaire idéal pour tous vos besoins commerciaux.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ])

  console.log("✅ Database seeded successfully!")
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
