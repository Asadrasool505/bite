"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AppContextType {
  // Auth
  user: any;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  
  // Favorites (Wishlist)
  favorites: any[];
  toggleFavorite: (product: any) => void;
  isFavorite: (id: string) => boolean;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;

  // Product Comparison
  compareList: any[];
  addToCompare: (product: any) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;

  // Theme Engine
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Localization / Language changer
  language: "en" | "zh" | "ja" | "ar" | "ru" | "de" | "fr" | "es";
  setLanguage: (lang: "en" | "zh" | "ja" | "ar" | "ru" | "de" | "fr" | "es") => void;
  t: (key: string) => string;

  // Currency engine
  currency: { code: "USD" | "EUR"; symbol: string; rate: number };
  formatPrice: (price: number) => string;

  // Catalogue modal global control
  catalogueOpen: boolean;
  setCatalogueOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  home: { en: "Home", de: "Startseite", fr: "Accueil", es: "Inicio" },
  products: { en: "Products", de: "Produkte", fr: "Produits", es: "Productos" },
  about: { en: "About", de: "Über Uns", fr: "À Propos", es: "Nosotros" },
  contact: { en: "Contact", de: "Kontakt", fr: "Contact", es: "Contacto" },
  request_quote: { en: "Request Quote", de: "Angebot", fr: "Demander Devis", es: "Solicitar" },
  login: { en: "Login", de: "Anmelden", fr: "Connexion", es: "Iniciar Sesión" },
  register: { en: "Register", de: "Registrieren", fr: "S'inscrire", es: "Registrarse" },
  logout: { en: "Logout", de: "Abmelden", fr: "Déconnexion", es: "Cerrar Sesión" },
  favorites: { en: "Favorites", de: "Favoriten", fr: "Favoris", es: "Favoritos" },
  compare: { en: "Compare", de: "Vergleichen", fr: "Comparer", es: "Comparar" },
  search: { en: "Search instruments...", de: "Suche Instrumente...", fr: "Recherche d'instruments...", es: "Buscar..." },
  technical_specs: { en: "Technical Specs:", de: "Tech Specs:", fr: "Specs Techniques:", es: "Especificaciones:" },
  add_to_quote: { en: "Add to Quote", de: "Ins Angebot", fr: "Ajouter au Devis", es: "Añadir a Cotización" },
  all_rights: { en: "All rights reserved", de: "Alle Rechte vorbehalten", fr: "Tous droits réservés", es: "Todos los derechos reservados" },
  empty_wishlist: { en: "Your wishlist is empty", de: "Ihr Wunschzettel ist leer", fr: "Votre liste de souhaits est vide", es: "Su lista está vacía" },
  compare_limit: { en: "Compare up to 4 instruments", de: "Max. 4 Instrumente vergleichen", fr: "Comparez jusqu'à 4 instruments", es: "Compare hasta 4 instrumentos" },
  sign_in_title: { en: "Sign In to BITE Instruments", de: "Bei BITE Instruments anmelden", fr: "Se connecter à BITE Instruments", es: "Iniciar sesión en BITE Instruments" },
  register_title: { en: "Create an Account", de: "Konto erstellen", fr: "Créer un compte", es: "Crear una cuenta" },
  wholesale_manufacturing: { en: "Sialkot Manufacturing", de: "Sialkot Herstellung", fr: "Fabrication Sialkot", es: "Fabricación Sialkot" },
  wholesale_inquiry: { en: "Wholesale Inquiry", de: "Großhandelsanfrage", fr: "Enquête de gros", es: "Consulta mayorista" },
  quality_guarantee: { en: "Quality Guarantee", de: "Qualitätsgarantie", fr: "Garantie de qualité", es: "Garantía de calidad" },
  distributor_application: { en: "Distributor Application", de: "Händlerbewerbung", fr: "Demande distributeur", es: "Solicitud de distribuidor" },
  warranty_returns: { en: "Warranty & Returns", de: "Garantie & Rückgabe", fr: "Garantie & retours", es: "Garantía y devoluciones" },
  shipping_policy: { en: "Shipping Policy", de: "Versandbedingungen", fr: "Politique d'expédition", es: "Política de envíos" },
  privacy_policy: { en: "Privacy Policy", de: "Datenschutz", fr: "Politique de confidentialité", es: "Política de privacidad" },
  terms_of_service: { en: "Terms of Service", de: "AGB", fr: "Conditions d'utilisation", es: "Términos del servicio" },
  refund_policy: { en: "Refund Policy", de: "Erstattungsrichtlinie", fr: "Politique de remboursement", es: "Política de reembolsos" },
  accessibility: { en: "Accessibility", de: "Barrierefreiheit", fr: "Accessibilité", es: "Accesibilidad" },
  custom_branding: { en: "Custom Branding", de: "Custom Branding", fr: "Marquage Personnalisé", es: "Personalización OEM" },
  download_catalogue: { en: "Download Catalogue", de: "Katalog Herunterladen", fr: "Télécharger Catalogue", es: "Descargar Catálogo" },
  catalogue_modal_title: { en: "Request B2B Export Catalogue", de: "B2B Exportkatalog anfordern", fr: "Demande Catalogue B2B", es: "Solicitar Catálogo B2B" },
  catalogue_modal_desc: { en: "Enter your wholesale details below to immediately request our latest 2026 manufacturing catalog.", de: "Geben Sie unten Ihre Großhandelsdaten ein, um unseren neuesten Herstellungskatalog 2026 anzufordern.", fr: "Entrez vos coordonnées pour demander notre catalogue 2026.", es: "Ingrese sus detalles mayoristas a continuación para solicitar nuestro último catálogo de fabricación 2026." },
  name_label: { en: "Customer Name", de: "Kundenname", fr: "Nom Client", es: "Nombre del Cliente" },
  company_label: { en: "Company Name", de: "Firmenname", fr: "Nom Société", es: "Nombre de la Empresa" },
  email_label: { en: "Professional Email", de: "Professionelle E-Mail", fr: "Email Professionnel", es: "Correo Profesional" },
  phone_label: { en: "WhatsApp / Phone", de: "WhatsApp / Telefon", fr: "WhatsApp / Téléphone", es: "WhatsApp / Teléfono" },
  submit_request: { en: "Submit Request", de: "Anfrage Senden", fr: "Envoyer Demande", es: "Enviar Solicitud" },
  processing: { en: "Processing...", de: "Wird verarbeitet...", fr: "Traitement...", es: "Procesando..." },
  oem_title: { en: "Interactive Custom Branding Preview", de: "Interaktive Custom-Branding-Vorschau", fr: "Aperçu Interactif du Marquage", es: "Vista Previa de Personalización OEM" },
  oem_instructions: { en: "Upload your logo in transparent PNG format for a real-time layout preview on our instruments.", de: "Laden Sie Ihr Logo im transparenten PNG-Format hoch, um eine Echtzeit-Vorschau auf unseren Instrumenten zu sehen.", fr: "Téléchargez votre logo PNG transparent pour un aperçu en temps réel.", es: "Suba su logotipo en formato PNG transparente para una vista previa en tiempo real sobre nuestros instrumentos." },
  choose_finish: { en: "Choose Instrument Finish", de: "Wählen Sie das Instrumentenfinish", fr: "Choisir la Finition de l'Instrument", es: "Elija el Acabado del Instrumento" },
  upload_logo: { en: "Upload Transparent Logo (PNG)", de: "Transparentes Logo hochladen (PNG)", fr: "Télécharger un Logo Transparent (PNG)", es: "Subir Logotipo Transparente (PNG)" },
  oem_section_title: { en: "Private Label & Custom Branding", de: "Eigenmarke & Custom Branding", fr: "Marque Privée & Personnalisation", es: "Marca Propia y Personalización OEM" },
  oem_section_desc: { en: "Upload your logo and preview your brand on our premium barber shears in real-time.", de: "Laden Sie Ihr Logo hoch und sehen Sie Ihre Marke in Echtzeit auf unseren Premium-Haarscheren.", fr: "Téléchargez votre logo et prévisualisez votre marque en temps réel.", es: "Suba su logotipo y previsualice su marca en nuestras tijeras premium en tiempo real." },
  oem_section_btn: { en: "Launch Branding Studio", de: "Branding Studio Starten", fr: "Lancer le Studio", es: "Iniciar Estudio de Marca" },
  catalogue_section_title: { en: "Global Wholesale Catalogue", de: "Globaler Großhandelskatalog", fr: "Catalogue de Gros Global", es: "Catálogo Mayorista Global" },
  catalogue_section_desc: { en: "Request our comprehensive manufacturing catalogue featuring high-grade J2 Japanese steel instruments.", de: "Fordern Sie unseren umfassenden Herstellungskatalog mit hochwertigen J2-Stahlinstrumenten an.", fr: "Demandez notre catalogue de fabrication complet d'instruments.", es: "Solicite nuestro catálogo completo de fabricación con instrumentos de acero japonés J2." },
  catalogue_section_btn: { en: "Download Catalogue", de: "Katalog Herunterladen", fr: "Télécharger le Catalogue", es: "Descargar Catálogo" },
  oem_teaser_title: { en: "YOUR BRAND. OUR CRAFTSMANSHIP.", de: "IHRE MARKE. UNSER HANDWERK.", fr: "VOTRE MARQUE. NOTRE SAVOIR-FAIRE.", es: "SU MARCA. NUESTRO ARTE." },
  oem_teaser_subtitle: { en: "Private Label & Laser-Engraved OEM Branding Studio", de: "Private Label & Laser-graviertes OEM-Branding-Studio", fr: "Studio de Marquage OEM & Personnalisation Gravée", es: "Estudio de Marca OEM y Grabado Láser Personalizado" },
  oem_teaser_btn: { en: "Launch Branding Studio 🚀", de: "Branding Studio Starten 🚀", fr: "Lancer le Studio de Marquage 🚀", es: "Iniciar Estudio de Marca 🚀" },
  certified_steel_specs: { en: "Certified Steel Specifications", de: "Zertifizierte Stahlspezifikationen", es: "Especificaciones de Acero Certificadas" },
  material_label: { en: "Material Composition", de: "Materialzusammensetzung", es: "Composición del Material" },
  hardness_label: { en: "Hardness Rating", de: "Härtegrad", es: "Clasificación de Dureza" },
  edge_label: { en: "Edge Profile", de: "Klingenprofil", es: "Perfil del Filo" },
  material_value: { en: "Japanese 440C Stainless Steel / High-Grade AISI 420", de: "Japanischer 440C Edelstahl / Hochwertiger AISI 420", es: "Acero Inoxidable Japonés 440C / AISI 420 de Alto Grado" },
  hardness_value: { en: "58-60 HRC Vacuum Heat Treated", de: "58-60 HRC Vakuum-wärmebehandelt", es: "58-60 HRC Tratamiento Térmico al Vacío" },
  edge_value: { en: "Razor-sharp convex edge for professional precision cutting", de: "Rasiermesserscharfer konvexer Schliff für professionelle Präzision", es: "Filo convexo afilado para un corte de precisión profesional" },
  shipping_calculator_title: { en: "Dynamic B2B Shipping & Production Lead-Time", de: "Dynamische B2B Versand- & Produktionszeiten", es: "Calculadora Dinámica de Envíos y Plazos de Producción" },
  select_region: { en: "Select Destination Region", de: "Bestimmungsregion Auswählen", es: "Seleccionar Región de Destino" },
  production_lead_time: { en: "Factory Production Lead-Time", de: "Herstellungszeit im Werk", es: "Plazo de Producción en Fábrica" },
  transit_time: { en: "Courier Transit Time", de: "Kurier-Transportzeit", es: "Tiempo de Tránsito del Courier" },
  total_delivery: { en: "Total Estimated Delivery", de: "Gesamte Geschätzte Lieferzeit", es: "Entrega Total Estimada" },
  request_sample: { en: "Request a Sample", de: "Muster Anfordern", es: "Solicitar Muestra" },
  sample_modal_title: { en: "Request Quality Verification Sample", de: "Muster zur Qualitätsprüfung Anfordern", es: "Solicitar Muestra de Control de Calidad" },
  sample_modal_desc: { en: "Enter your B2B wholesale credentials to request a sample tool for factory quality inspection.", de: "Geben Sie Ihre B2B-Großhandelsdaten ein, um ein Testinstrument zur Qualitätsprüfung anzufordern.", es: "Ingrese sus credenciales de B2B para solicitar un instrumento de muestra para la inspección de calidad de fábrica." },
  courier_acc_label: { en: "DHL / FedEx Account Number (Optional)", de: "DHL / FedEx Kontonummer (Optional)", es: "Número de Cuenta DHL / FedEx (Opcional)" },
  sample_disclaimer: { en: "Note: Sample instruments are provided free of charge for factory quality inspection. The client is only responsible for direct DHL/FedEx shipping/courier handling fees.", de: "Hinweis: Testinstrumente werden für die Qualitätsprüfung kostenlos zur Verfügung gestellt. Der Kunde trägt nur die direkten DHL/FedEx-Versandkosten.", es: "Nota: Los instrumentos de muestra se proporcionan sin costo para la inspección de calidad de fábrica. El cliente es el único responsable de las tarifas de envío y manejo de DHL/FedEx." },
  sample_success_msg: { en: "Thank you! Your quality sample request has been securely logged. Our logistics department will contact you within 24 hours to verify courier coordinates.", de: "Vielen Dank! Ihre Musteranfrage wurde registriert. Unsere Logistikabteilung wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.", es: "¡Gracias! Su solicitud de muestra de calidad ha sido registrada de forma segura. Nuestro departamento de logística se comunicará con usted en 24 horas." },
  track_order_title: { en: "Automated Factory Production Tracking", de: "Automatisierte Produktionsverfolgung", es: "Seguimiento Automatizado de Producción en Fábrica" },
  tracking_id_placeholder: { en: "Enter Quote / Order Reference ID (e.g. QUOTE-12345)", de: "Geben Sie die Angebots-/Bestellnummer ein (z.B. QUOTE-12345)", es: "Ingrese el ID de Referencia de Cotización/Pedido (ej. QUOTE-12345)" },
  track_button: { en: "Check Status 🔍", de: "Status Überprüfen 🔍", es: "Verificar Estado 🔍" },
  tracking_not_found: { en: "Order reference not found in active database. Rendering live factory simulation workflow below...", de: "Bestellnummer nicht in der Datenbank gefunden. Unten wird eine Live-Werkssimulation angezeigt...", es: "Referencia no encontrada. Mostrando flujo de simulación en vivo a continuación..." },
  stage_1_title: { en: "Stage 1: Material Selection & Forging ⚙️", de: "Stufe 1: Materialauswahl & Schmieden ⚙️", es: "Etapa 1: Selección de Materiales y Forja ⚙️" },
  stage_1_desc: { en: "Hand-selecting high-grade Japanese 440C/AISI 420 stainless steel alloys. Blades are hot-forged and precision vacuum heat-treated to achieve optimal Rockwell hardness.", de: "Handverlesene japanische 440C/AISI 420 Edelstahllegierungen. Die Klingen werden heiß geschmiedet und vakuum-wärmebehandelt für optimale Rockwell-Härte.", es: "Selección manual de acero inoxidable japonés 440C/AISI 420. Las hojas se forjan en caliente y se tratan al vacío para lograr una dureza óptima." },
  stage_2_title: { en: "Stage 2: Hollow Grinding & Professional Shaping 📐", de: "Stufe 2: Hohlschliff & Professionelle Formgebung 📐", es: "Etapa 2: Rectificado Cóncavo y Moldeado Profesional 📐" },
  stage_2_desc: { en: "Master artisans perform hollow grinding, shaping convex razor-sharp edges and matching blades for effortless, silent pet grooming precision.", de: "Erfahrene Handwerker führen den Hohlschliff durch, formen konvexe rasiermesserscharfe Kanten und stimmen die Klingen aufeinander ab.", es: "Artesanos expertos realizan el rectificado cóncavo, perfilando filos convexos y alineando hojas para una precisión de corte silenciosa." },
  stage_3_title: { en: "Stage 3: Custom Laser-Engraving & Private Branding ✒️", de: "Stufe 3: Custom Laser-Gravur & Branding ✒️", es: "Etapa 3: Grabado Láser Personalizado y Marca ✒️" },
  stage_3_desc: { en: "Applying custom client logos and branding parameters using state-of-the-art precision optical laser-engraving systems.", de: "Aufbringen von Kundenlogos und Branding-Parametern mittels hochmoderner optischer Präzisionslaser-Gravursysteme.", es: "Aplicación de logotipos y parámetros de marca utilizando sistemas avanzados de grabado láser óptico de alta precisión." },
  stage_4_title: { en: "Stage 4: Mastery Sharpness Alignment & QA Testing 🎯", de: "Stufe 4: Meister-Schärfeausrichtung & QS-Prüfung 🎯", es: "Etapa 4: Alineación de Filo Maestro y Pruebas de Calidad 🎯" },
  stage_4_desc: { en: "Micron-level sharpness inspection and tension alignment. Each shear undergoes strict factory QA testing on synthetic hair fiber meshes.", de: "Schärfeprüfung im Mikrometerbereich und Spannungsausrichtung. Jede Schere wird strengen QS-Tests an synthetischen Haarfasern unterzogen.", es: "Inspección de afilado a nivel de micras y ajuste de tensión. Cada tijera se somete a estrictas pruebas de calidad de fábrica." },
  stage_5_title: { en: "Stage 5: Secure Packaging & Courier Dispatch ✈️", de: "Stufe 5: Sichere Verpackung & Kurierversand ✈️", es: "Etapa 5: Embalaje Seguro y Envío por Courier ✈️" },
  stage_5_desc: { en: "Instruments are oiled, sealed in leather presentation cases, and handed over to DHL Express/FedEx Priority for global air transit.", de: "Die Instrumente werden geölt, in Lederetuis versiegelt und an DHL Express/FedEx Priority für den weltweiten Lufttransport übergeben.", es: "Los instrumentos se lubrican, se sellan en estuches de cuero y se entregan a DHL Express/FedEx Priority para su tránsito aéreo global." },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const [compareList, setCompareList] = useState<any[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguageState] = useState<"en" | "zh" | "ja" | "ar" | "ru" | "de" | "fr" | "es">("en");
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  // 1. Supabase Auth Initialization
  useEffect(() => {
    // Check local storage fallback first
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("local_simulated_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          setLoading(false);
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    }).catch(err => {
      console.warn("Supabase auth session fetch skipped (simulation mode active)");
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase signup failed, initiating local simulated B2B buyer login:", err);
      // Simulate local buyer profile
      const mockUser = {
        id: "local-simulated-b2b-buyer-id",
        email: email,
        user_metadata: metadata || {
          full_name: "Valued Importer",
          company_name: "Bite Partner Ltd",
          whatsapp: "+923001234567"
        }
      };
      setUser(mockUser as any);
      if (typeof window !== "undefined") {
        localStorage.setItem("local_simulated_user", JSON.stringify(mockUser));
      }
      return { user: mockUser };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase signin failed, initiating local simulated B2B buyer login:", err);
      // Simulate local buyer profile
      const mockUser = {
        id: "local-simulated-b2b-buyer-id",
        email: email,
        user_metadata: {
          full_name: "Valued Importer",
          company_name: "Bite Partner Ltd",
          whatsapp: "+923001234567"
        }
      };
      setUser(mockUser as any);
      if (typeof window !== "undefined") {
        localStorage.setItem("local_simulated_user", JSON.stringify(mockUser));
      }
      return { user: mockUser };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signout failed, clearing local session:", err);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("local_simulated_user");
      }
    }
  };

  // 2. Favorites Logic
  useEffect(() => {
    const savedFavs = localStorage.getItem("bite_instruments_favorites");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }
  }, []);

  const toggleFavorite = (product: any) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem("bite_instruments_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.some((item) => item.id === id);

  // 3. Comparison Logic
  useEffect(() => {
    const savedCompare = localStorage.getItem("bite_instruments_compare");
    if (savedCompare) {
      try { setCompareList(JSON.parse(savedCompare)); } catch (e) { console.error(e); }
    }
  }, []);

  const addToCompare = (product: any) => {
    setCompareList((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      if (prev.length >= 4) {
        alert(t("compare_limit"));
        return prev;
      }
      const updated = [...prev, product];
      localStorage.setItem("bite_instruments_compare", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("bite_instruments_compare", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("bite_instruments_compare");
  };

  // 4. Theme Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("bite_instruments_theme") as "dark" | "light";
    const currentTheme = savedTheme || "dark";
    setTheme(currentTheme);
    
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("bite_instruments_theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 5. Localization & Currency Synchronization Logic
  const [currency, setCurrency] = useState<{ code: "USD" | "EUR"; symbol: string; rate: number }>({
    code: "USD",
    symbol: "$",
    rate: 1.0,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("bite_instruments_lang") as any;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  // Sync currency automatically with language defaults
  useEffect(() => {
    if (language === "de" || language === "es") {
      setCurrency({ code: "EUR", symbol: "€", rate: 0.92 });
    } else {
      setCurrency({ code: "USD", symbol: "$", rate: 1.0 });
    }
  }, [language]);

  const setLanguage = (lang: "en" | "zh" | "ja" | "ar" | "ru" | "de" | "fr" | "es") => {
    setLanguageState(lang);
    localStorage.setItem("bite_instruments_lang", lang);
  };

  const t = (key: string): string => {
    const term = translations[key];
    if (!term) return key;
    return term[language] || term["en"] || key;
  };

  const formatPrice = (price: number): string => {
    const converted = price * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesOpen,
        setFavoritesOpen,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        compareOpen,
        setCompareOpen,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        currency,
        formatPrice,
        catalogueOpen,
        setCatalogueOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
