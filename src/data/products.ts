import productsJson from '../../products.json';
import { only_pet_products } from './only_pet_products';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  features?: string[];
  on_main_page?: boolean;
  is_variable?: boolean;
  is_featured?: boolean;
  technical_specifications?: {
    material: string;
    handle: string;
    edge: string;
    finish: string;
    sizes: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export function getSanitizedPetProduct(product: any, index: number) {
  // Locate the matching pet product from only_pet_products
  const petIndex = only_pet_products.findIndex(p => p.id === product.id || p.sku === product.sku);
  const actualIndex = petIndex !== -1 ? petIndex : index;
  const sourcePet = only_pet_products[actualIndex % only_pet_products.length];
  
  const name = product.name || sourcePet?.name || "Professional Pet Grooming Tool";
  const sku = product.sku || sourcePet?.sku || `BITE-PET-${actualIndex}`;
  const price = product.price || 12;
  const category = (product.category || sourcePet?.category || "").toLowerCase();

  const rawDescription = sourcePet?.description || product.description || "Premium professional pet grooming tool.";
  const cleanDescription = rawDescription
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\\\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 1 & 2. Parse Product Titles and Generate Distinct Copy
  let specificDetails = "";
  if (
    name.toLowerCase().includes('nail') || 
    name.toLowerCase().includes('clipper') || 
    name.toLowerCase().includes('trimmer') || 
    name.toLowerCase().includes('cutter') || 
    category.includes('nail') || 
    category.includes('cutter')
  ) {
    if (price < 10) {
      specificDetails = "Featuring a compact design with sharp semi-circular stainless steel angles, this instrument is perfect for home grooming, puppies, and small-to-medium paws, equipped with an integrated safety stop guard.";
    } else if (price >= 10 && price < 15) {
      specificDetails = "Featuring a balanced frame, this clipper showcases surgical stainless steel claws, a quick-locking safety mechanism, and medium-tension return springs suitable for all dog and cat breeds.";
    } else {
      specificDetails = "Engineered as a heavy-duty commercial salon build, it boasts a high-tension internal spring mechanism for thick stubborn claws, paired with ergonomic non-slip grooved rubber handles for all-day grooming endurance.";
    }
  } else if (
    name.toLowerCase().includes('brush') || 
    name.toLowerCase().includes('dematting') || 
    name.toLowerCase().includes('coat') || 
    name.toLowerCase().includes('slicker') || 
    category.includes('brush') || 
    category.includes('coat') || 
    category.includes('slicker')
  ) {
    if (price < 15) {
      specificDetails = "Featuring anti-scratch protective grooming pins and a lightweight polymer frame, this brush is optimized for daily detangling and dead fur removal on sensitive small-to-medium pets.";
    } else if (price >= 15 && price < 25) {
      specificDetails = "Equipped with medium-gauge stainless steel long pins and a shock-absorbing handle, it excels at deshedding dense undercoats without scratching or skin irritation.";
    } else {
      specificDetails = "Engineered for high-volume commercial salons, it showcases a heavy-duty beechwood handle and flexible polished pins for rapid undermats and dead fur removal on large breeds.";
    }
  } else {
    // Shears and Scissors
    if (name.toLowerCase().includes('curved') || name.toLowerCase().includes('bending')) {
      specificDetails = "This curved shear features precision-ground blades with a smooth arc, ideal for shaping rounded heads, paws, and delicate contouring work.";
    } else if (name.toLowerCase().includes('thinning') || name.toLowerCase().includes('chunker') || name.toLowerCase().includes('blender')) {
      specificDetails = "Equipped with micro-serrated texturizing teeth, this chunker shear provides seamless bulk removal and natural finishing touches.";
    } else {
      specificDetails = "This straight shear offers a razor-sharp micro-serrated edge for crisp lines and clean block trimming.";
    }
    
    if (price < 15) {
      specificDetails += " Constructed with a lightweight alloy body, it offers comfortable finger inserts for precision trimming.";
    } else {
      specificDetails += " Built with a premium luxury alloy body and an adjustable gold tension dial, it stands up to heavy commercial salon usage.";
    }
  }

  // Variations to prevent visual/structural overlap
  const introVariations = [
    `The ${name} (SKU: ${sku}) stands as a cornerstone of our pet instruments lineup, providing unparalleled value for commercial buyers.`,
    `Engineered to meet strict veterinary standards, the ${name} (SKU: ${sku}) offers professional groomers a highly efficient solution.`,
    `As a premier choice in grooming equipment, the ${name} (SKU: ${sku}) is designed for continuous daily operations.`,
    `Crafted specifically for heavy salon workloads, the ${name} (SKU: ${sku}) delivers reliable performance day after day.`,
    `Our high-end ${name} (SKU: ${sku}) combines modern ergonomics with traditional craftsmanship for superior handling.`,
    `The ${name} (SKU: ${sku}) is the ultimate addition to any premium grooming collection, maximizing productivity.`,
    `Designed with the professional stylist in mind, the ${name} (SKU: ${sku}) provides outstanding comfort and control.`,
    `This premium variant, the ${name} (SKU: ${sku}), is meticulously calibrated to deliver high-precision results.`
  ];

  const B2BIntro = introVariations[actualIndex % introVariations.length];

  // 3. Embed B2B SEO Keywords Natively
  const seoPhrases = [
    "As part of our premium professional-grade grooming supplies, this tool showcases surgical stainless steel durability and represents our commitment to factory-direct export quality.",
    "Designed as essential ergonomic pet salon equipment, it delivers long-lasting comfort and stands as a testament to our bulk manufacturing excellence.",
    "Grooming professionals trust this instrument for its surgical stainless steel durability, which makes it a standout piece of ergonomic pet salon equipment manufactured with bulk manufacturing excellence.",
    "With factory-direct export quality at its core, this product adds exceptional value to our catalog of professional-grade grooming supplies for veterinary clinics.",
    "We guarantee bulk manufacturing excellence and surgical stainless steel durability across all our professional-grade grooming supplies exported globally."
  ];

  const seoSegment = seoPhrases[actualIndex % seoPhrases.length];

  const b2bDetails = [
    "Our Sialkot factory supplies this model in bulk shipments with custom branding options available for orders exceeding 100 units.",
    "Designed to withstand autoclaving and rigorous sterilization protocols required in clinical veterinary settings.",
    "Each unit is hand-adjusted and balanced at our forge to ensure flawless out-of-the-box operation.",
    "Features a rust-resistant chromium-plated coating to maintain its pristine appearance after numerous wash cycles.",
    "Highly recommended for high-volume pet salons looking to standardize their grooming kits.",
    "Includes our standard B2B manufacturer warranty protecting against alloy defects and structural failures.",
    "Ships in bulk-ready protective packaging to reduce shipping volume and import duties.",
    "Perfect for wholesale distributors catering to professional grooming salons and specialized retail outlets."
  ];

  const b2bSegment = b2bDetails[actualIndex % b2bDetails.length];

  // 4. Strip unwanted artifacts and assemble
  const finalDescription = `<p><strong>${B2BIntro}</strong> ${specificDetails} ${seoSegment} ${b2bSegment}</p><div class="mt-2 text-slate-500 text-xs">${cleanDescription}</div>`
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\\\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const uniqueSpecs = sourcePet?.technical_specifications || product.technical_specifications;

  return {
    ...product,
    description: finalDescription,
    technical_specifications: uniqueSpecs
  };
}

export const productsData: Product[] = productsJson.map((product: any, index: number) => {
  if (product.id && product.id.startsWith('pet-')) {
    return getSanitizedPetProduct(product, index);
  }
  return product;
});

export default productsData;
