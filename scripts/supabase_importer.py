import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env.local
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("Supabase credentials missing! Check your .env.local file.")

supabase: Client = create_client(url, key)

def transform_description(description: str) -> str:
    """
    Transforms the raw scraped description into a professional, SEO-friendly format.
    Ensures our core manufacturing identity is present.
    """
    brand_signature = " Handcrafted by Bite Instruments, Sialkot."
    
    # Simple check to avoid duplicating the signature if we run the script twice
    if "Bite Instruments" not in description:
        return f"{description.strip()}{brand_signature}"
    return description.strip()

def insert_product(product_data: dict) -> dict:
    """
    Pushes a single product dictionary into the 'products' table.
    """
    # 1. Transform the description for SEO & Branding
    if 'description' in product_data:
        product_data['description'] = transform_description(product_data['description'])
    
    # 2. Ensure an ID exists (Supabase requires the 'id' text primary key based on our schema)
    if 'id' not in product_data:
        # We can generate a unique slug or use UUID
        # Example slug: "straight-shears-elite-8.0"
        name_slug = product_data.get('name', 'product').lower().replace(' ', '-')
        product_data['id'] = f"{name_slug}-{str(uuid.uuid4())[:8]}"

    try:
        # Insert data into Supabase
        response = supabase.table('products').insert(product_data).execute()
        print(f"✅ Successfully inserted: {product_data['name']}")
        return response.data
    except Exception as e:
        print(f"❌ Failed to insert {product_data.get('name', 'Unknown')}: {e}")
        return None

def run_batch_import():
    """
    Example function showing how to loop through a batch of scraped products 
    (like data extracted from Kenchii) and upload them to Supabase.
    """
    print("Starting Batch Import Process...")
    
    # Mock data representing the scraped payload
    scraped_batch = [
        {
            "name": "Bite Elite Master 8.0\" Straight",
            "category": "straight-shears",
            "steel_type": "Authentic Japanese J2 Steel",
            "size": "8.0\"",
            "description": "An ultra-smooth convex edge designed for flawless finishing and precision grooming.",
            "features": ["Ergonomic Handle", "Convex Edge", "Silver Mirror-Polish Finish"],
            "image_url": "/assets/straight-elite-j2.png",
            "price": "$185.00"
        },
        {
            "name": "Bite Pro-Sialkot 7.5\" Curved",
            "category": "curved-shears",
            "steel_type": "Authentic Japanese 440C Steel",
            "size": "7.5\"",
            "description": "Engineered for everyday salon use, offering unmatched durability and smooth contouring.",
            "features": ["Gold Tension Dial", "Ergonomic Offset Handle", "Curved Convex Edge"],
            "image_url": "/assets/curved-pro-sialkot.png",
            "price": "$145.00"
        }
        # Add the remaining 10-20 products here...
    ]

    # Loop and upload
    for product in scraped_batch:
        insert_product(product)
        
    print("Batch Import Complete!")

if __name__ == "__main__":
    run_batch_import()
