import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">Tanganyika Business Company</h3>
            <p className="mb-4">
              Votre partenaire commercial de confiance au Burundi et dans la région des Grands Lacs.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-yellow-500 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-yellow-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-yellow-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-yellow-500 transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-500 transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/publicite" className="hover:text-yellow-500 transition-colors">
                  Publicité
                </Link>
              </li>
              <li>
                <Link href="/espaces" className="hover:text-yellow-500 transition-colors">
                  Nos Espaces
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>123 Avenue de la Liberté, Bujumbura, Burundi</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span>+257 22 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span>info@tanganyika.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">Heures d'Ouverture</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Lundi - Vendredi:</span>
                <span>8h - 18h</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi:</span>
                <span>9h - 15h</span>
              </li>
              <li className="flex justify-between">
                <span>Dimanche:</span>
                <span>Fermé</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tanganyika Business Company. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
