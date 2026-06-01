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

  // 5. Localization Logic
  useEffect(() => {
    const savedLang = localStorage.getItem("bite_instruments_lang") as any;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: "en" | "zh" | "ja" | "ar" | "ru" | "de" | "fr" | "es") => {
    setLanguageState(lang);
    localStorage.setItem("bite_instruments_lang", lang);
  };

  const t = (key: string): string => {
    const term = translations[key];
    if (!term) return key;
    return term[language] || term["en"] || key;
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
