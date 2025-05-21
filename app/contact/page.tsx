"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Clock, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFormStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus("idle")
      }, 5000)
    } catch (error) {
      setFormStatus("error")
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:py-32 bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Contactez Tanganyika Business Company"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-Nous</h1>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-200">
              Nous sommes à votre écoute. N&apos;hésitez pas à nous contacter pour toute question ou demande
              d&apos;information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Notre Adresse</h3>
              <p className="text-gray-600">
                123 Avenue Principale
                <br />
                Bujumbura, Burundi
              </p>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Email</h3>
              <p className="text-gray-600">
                info@tanganyikabusinesscompany.bi
                <br />
                support@tanganyikabusinesscompany.bi
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Téléphone</h3>
              <p className="text-gray-600">
                +257 12 345 678
                <br />
                +257 98 765 432
              </p>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Heures d&apos;Ouverture</h3>
              <p className="text-gray-600">
                Lundi - Vendredi: 8h00 - 18h00
                <br />
                Samedi: 9h00 - 15h00
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map and Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-[400px] md:h-[500px] relative rounded-lg overflow-hidden shadow-lg"
            >
              {/* Placeholder for a map - in a real implementation, you would use Google Maps or another map provider */}
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Carte de localisation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="font-semibold">Tanganyika Business Company</h3>
                  <p className="text-sm text-gray-600">123 Avenue Principale, Bujumbura</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Envoyez-nous un message</h2>
              <div className="w-20 h-1 bg-yellow-600 mb-6"></div>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              {formStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Envoyé!</h3>
                  <p className="text-green-700">
                    Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 mt-1"
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? "Envoi en cours..." : "Envoyer Message"}
                  </Button>
                  {formStatus === "error" && (
                    <p className="text-red-500 text-center">
                      Une erreur s&apos;est produite. Veuillez réessayer plus tard.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions Fréquentes</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-700">
              Trouvez rapidement des réponses aux questions les plus courantes.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* FAQ Item 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Quels sont vos délais de livraison?</h3>
                <p className="text-gray-600">
                  Nos délais de livraison varient en fonction de votre localisation. En général, nous livrons à
                  Bujumbura sous 24-48h et dans les autres régions du Burundi sous 2-5 jours ouvrables.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Acceptez-vous les retours de produits?</h3>
                <p className="text-gray-600">
                  Oui, nous acceptons les retours dans les 14 jours suivant la réception du produit, à condition
                  qu&apos;il soit dans son état d&apos;origine. Veuillez nous contacter avant de retourner un article.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Quels modes de paiement acceptez-vous?</h3>
                <p className="text-gray-600">
                  Nous acceptons les paiements par carte bancaire, mobile money (M-Pesa, Airtel Money), et en espèces à
                  la livraison pour les commandes à Bujumbura.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Proposez-vous des services d&apos;installation?</h3>
                <p className="text-gray-600">
                  Oui, pour certains produits comme les équipements électroniques et les meubles, nous proposons des
                  services d&apos;installation moyennant des frais supplémentaires.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
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
      </footer>
    </div>
  )
}
