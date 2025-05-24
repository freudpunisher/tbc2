"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { CheckCircle, Users, Award, TrendingUp, Clock } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // State for fetched data
  const [aboutContent, setAboutContent] = useState([])
  const [values, setValues] = useState([])
  const [milestones, setMilestones] = useState([])
  const [team, setTeam] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const [aboutRes, valuesRes, milestonesRes, teamRes] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/values"),
          fetch("/api/milestones"),
          fetch("/api/team"),
        ])

        if (!aboutRes.ok || !valuesRes.ok || !milestonesRes.ok || !teamRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const aboutData = await aboutRes.json()
        const valuesData = await valuesRes.json()
        const milestonesData = await milestonesRes.json()
        const teamData = await teamRes.json()

        setAboutContent(aboutData)
        setValues(valuesData)
        setMilestones(milestonesData)
        setTeam(teamData)
      } catch (err) {
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper to get about section content by section name
  const getAboutSection = (section) => {
    return aboutContent.find((item) => item.section === section) || {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Erreur: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:py-32 bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={getAboutSection("hero").imageUrl || "/placeholder.svg?height=600&width=1200"}
            alt="Tanganyika Business Company"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{getAboutSection("hero").title || "À Propos de Nous"}</h1>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-200">
              {getAboutSection("hero").content ||
                "Découvrez l'histoire, les valeurs et la mission de Tanganyika Business Company, votre partenaire commercial de confiance au Burundi depuis plus de 15 ans."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={getAboutSection("story").imageUrl || "/placeholder.svg?height=600&width=800"}
                alt={getAboutSection("story").title || "Notre Histoire"}
                width={600}
                height={450}
                className="rounded-lg shadow-xl"
              />
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{getAboutSection("story").title || "Notre Histoire"}</h2>
              <div className="w-20 h-1 bg-yellow-600 mb-6"></div>
              <p className="text-gray-700 mb-6">{getAboutSection("story").content}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Valeurs</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-700">
              Nos valeurs fondamentales guident chaque décision que nous prenons et chaque interaction avec nos clients,
              partenaires et employés.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.length > 0 ? (
              values.map((value) => (
                <motion.div
                  key={value.id}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-center col-span-full">Aucune valeur disponible.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Équipe</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-700">
              Notre succès repose sur notre équipe dévouée de professionnels qui partagent notre vision et nos valeurs.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.length > 0 ? (
              team.map((member) => (
                <motion.div key={member.id} variants={fadeInUp} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-yellow-600 mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-center col-span-full">Aucun membre d'équipe disponible.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Parcours</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-300">
              Quelques moments clés qui ont marqué notre histoire et notre croissance.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="space-y-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {milestones.length > 0 ? (
                milestones.map((milestone) => (
                  <motion.div key={milestone.id} variants={fadeInUp} className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex flex-col items-center md:items-end">
                      <div className="bg-yellow-600 text-white text-xl font-bold px-4 py-2 rounded">{milestone.year}</div>
                      <div className="h-full w-1 bg-yellow-600 hidden md:block mt-2"></div>
                    </div>
                    <div className="md:w-3/4 bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center col-span-full">Aucun jalon disponible.</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Nous Choisir</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-700">
              Découvrez ce qui fait de Tanganyika Business Company le partenaire idéal pour tous vos besoins
              commerciaux.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Produits de Qualité</h3>
                  <p className="text-gray-600">
                    Nous sélectionnons rigoureusement chaque produit pour garantir la plus haute qualité à nos clients.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Service Client Exceptionnel</h3>
                  <p className="text-gray-600">
                    Notre équipe dévouée est toujours prête à vous aider et à répondre à toutes vos questions.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expertise Reconnue</h3>
                  <p className="text-gray-600">
                    Avec 15 ans d'expérience, nous sommes devenus une référence dans notre domaine au Burundi.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation Constante</h3>
                  <p className="text-gray-600">
                    Nous recherchons continuellement de nouveaux produits et solutions pour répondre à vos besoins.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
                  <p className="text-gray-600">
                    Notre réseau logistique efficace nous permet de livrer vos commandes rapidement et en toute sécurité.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-50 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Engagement Local</h3>
                  <p className="text-gray-600">
                    Nous sommes fiers de contribuer au développement économique et social du Burundi.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter/>
      {/* <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Tanganyika Business Company Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-bold">TANGANYIKA BUSINESS COMPANY</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} Tanganyika Business Company. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  )
}
