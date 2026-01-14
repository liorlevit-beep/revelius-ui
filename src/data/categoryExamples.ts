/**
 * Product examples for each Revelius category
 * This is client-side enrichment to help explain what each category means
 */

export interface CategoryExamples {
  description?: string;
  examples: string[];
}

export const categoryExamples: Record<string, CategoryExamples> = {
  // Tobacco & Smoking
  "Cigar Stores and Stands": {
    description: "Tobacco products and smoking accessories",
    examples: [
      "Cuban cigars (single sticks)",
      "Premium cigar sampler boxes",
      "Humidors and cigar accessories",
      "Monthly cigar subscription boxes",
      "Cigar cutters and lighters",
    ],
  },
  "Tobacco Stores": {
    description: "Retail tobacco and vaping products",
    examples: [
      "Cigarettes and tobacco pouches",
      "Rolling papers and filters",
      "E-cigarettes and vape pens",
      "Nicotine replacement products",
      "Pipe tobacco and accessories",
    ],
  },

  // Adult & Dating
  "Dating and Escort Services": {
    description: "Matchmaking and companionship services",
    examples: [
      "Paid dating memberships",
      "One-on-one matchmaking services",
      "Premium messaging credits",
      "Adult companionship booking",
      "Virtual dating experiences",
    ],
  },
  "Adult Content and Services": {
    description: "Age-restricted digital content",
    examples: [
      "Premium video subscriptions",
      "Live streaming credits",
      "Pay-per-view content",
      "Digital magazines and photo sets",
      "Interactive chat services",
    ],
  },

  // Cannabis & CBD
  "CBD and Marijuana Products": {
    description: "Hemp and cannabis-derived products",
    examples: [
      "CBD oil tinctures",
      "CBD vape cartridges",
      "Hemp-derived gummies",
      "THC flower (licensed regions)",
      "Cannabis edibles and beverages",
      "Topical CBD creams and balms",
    ],
  },

  // Gambling & Gaming
  "Online Gambling": {
    description: "Internet-based betting and wagering",
    examples: [
      "Sports betting deposits",
      "Online casino chips",
      "Poker tournament buy-ins",
      "Daily fantasy sports entries",
      "Virtual slot machine credits",
    ],
  },
  "Lottery and Betting": {
    description: "Lottery tickets and wagering services",
    examples: [
      "State lottery tickets",
      "Scratch-off cards",
      "Raffle entries",
      "Horse racing bets",
      "Bingo cards and sessions",
    ],
  },
  "Gaming and Casino": {
    description: "Physical and digital gaming services",
    examples: [
      "Casino chips and credits",
      "In-game virtual currency",
      "Gaming tournament entries",
      "Arcade tokens and cards",
      "Loot boxes and digital items",
    ],
  },

  // Firearms & Weapons
  "Firearms, Ammunition and Weapons": {
    description: "Weapons and related accessories",
    examples: [
      "Handguns and rifles",
      "Ammunition and magazines",
      "Gun safes and locks",
      "Holsters and carrying cases",
      "Shooting range memberships",
      "Firearm cleaning kits",
    ],
  },

  // Pharmaceuticals & Supplements
  "Pharmaceuticals and Supplements": {
    description: "Medications and dietary supplements",
    examples: [
      "Prescription medications",
      "Over-the-counter drugs",
      "Dietary supplements and vitamins",
      "Herbal remedies",
      "Protein powders and sports nutrition",
      "Medical devices and supplies",
    ],
  },

  // Cryptocurrency
  "Cryptocurrency and Blockchain": {
    description: "Digital currency and blockchain services",
    examples: [
      "Bitcoin and altcoin purchases",
      "Crypto wallet services",
      "NFT marketplace transactions",
      "Blockchain node hosting",
      "Staking and yield farming",
      "Crypto trading platform fees",
    ],
  },

  // Financial Services
  "Money Transfer and Financial Services": {
    description: "Payment and money movement services",
    examples: [
      "Wire transfer fees",
      "International remittances",
      "Peer-to-peer payment services",
      "Currency exchange",
      "Check cashing services",
      "Prepaid card loading",
    ],
  },
  "Investment and Trading": {
    description: "Securities and investment platforms",
    examples: [
      "Stock trading commissions",
      "Mutual fund purchases",
      "Robo-advisor management fees",
      "Options and futures contracts",
      "Investment research subscriptions",
    ],
  },

  // Alcohol
  "Liquor Stores": {
    description: "Alcoholic beverages for retail",
    examples: [
      "Wine bottles and cases",
      "Spirits and liquor",
      "Craft beer and imports",
      "Monthly wine subscriptions",
      "Rare whiskey collectibles",
    ],
  },

  // Telemarketing & Direct Sales
  "Telemarketing and Direct Sales": {
    description: "Direct-to-consumer sales campaigns",
    examples: [
      "Subscription box enrollments",
      "Extended warranty products",
      "Time-share presentations",
      "Magazine subscriptions",
      "Charitable donation drives",
    ],
  },

  // Digital Goods
  "Digital Goods and Software": {
    description: "Downloadable products and licenses",
    examples: [
      "Software licenses and subscriptions",
      "E-books and audiobooks",
      "Music and video downloads",
      "Mobile app purchases",
      "Online course enrollments",
      "Digital art and templates",
    ],
  },

  // Travel & Lodging
  "Travel and Tourism": {
    description: "Travel services and accommodations",
    examples: [
      "Flight bookings",
      "Hotel reservations",
      "Vacation packages",
      "Cruise tickets",
      "Travel insurance",
      "Car rental services",
    ],
  },

  // Electronics & Tech
  "Electronics and Computers": {
    description: "Consumer electronics and accessories",
    examples: [
      "Laptops and tablets",
      "Smartphones and wearables",
      "Gaming consoles",
      "Computer components and peripherals",
      "Audio equipment and headphones",
    ],
  },

  // Fashion & Apparel
  "Clothing and Apparel": {
    description: "Fashion and clothing items",
    examples: [
      "Men's and women's clothing",
      "Shoes and accessories",
      "Jewelry and watches",
      "Designer handbags",
      "Seasonal fashion collections",
    ],
  },

  // Health & Wellness
  "Health and Wellness": {
    description: "Health services and products",
    examples: [
      "Gym memberships",
      "Fitness equipment",
      "Wellness coaching sessions",
      "Massage therapy",
      "Nutritionist consultations",
      "Mental health apps",
    ],
  },

  // Entertainment
  "Entertainment and Media": {
    description: "Entertainment content and services",
    examples: [
      "Streaming service subscriptions",
      "Concert and event tickets",
      "Movie theater passes",
      "Magazine and newspaper subscriptions",
      "Podcast premium content",
    ],
  },

  // Food & Beverage
  "Restaurants and Food Delivery": {
    description: "Dining and food services",
    examples: [
      "Restaurant meals and reservations",
      "Food delivery orders",
      "Meal kit subscriptions",
      "Catering services",
      "Ghost kitchen orders",
    ],
  },

  // Education
  "Education and Training": {
    description: "Educational services and courses",
    examples: [
      "Online course enrollments",
      "Tutoring sessions",
      "Professional certifications",
      "Language learning apps",
      "Educational software licenses",
    ],
  },

  // Retail (General)
  "General Retail": {
    description: "Broad retail merchandise",
    examples: [
      "Home goods and furniture",
      "Pet supplies",
      "Books and stationery",
      "Toys and games",
      "Sporting goods",
      "Garden and outdoor equipment",
    ],
  },

  // Automotive
  "Automotive and Vehicle Services": {
    description: "Vehicle-related products and services",
    examples: [
      "Auto parts and accessories",
      "Vehicle maintenance services",
      "Car wash subscriptions",
      "Tire purchases and installation",
      "Vehicle detailing",
    ],
  },

  // Professional Services
  "Professional Services": {
    description: "Business and professional consulting",
    examples: [
      "Legal consultations",
      "Accounting and tax services",
      "Marketing and advertising services",
      "Web design and development",
      "Business coaching",
    ],
  },

  // Utilities & Subscriptions
  "Utilities and Subscriptions": {
    description: "Recurring services and utilities",
    examples: [
      "Utility bill payments",
      "Phone and internet services",
      "Cloud storage subscriptions",
      "Software-as-a-Service (SaaS)",
      "Membership dues",
    ],
  },

  // Beauty & Cosmetics
  "Beauty and Cosmetics": {
    description: "Beauty products and cosmetic services",
    examples: [
      "Skincare products and serums",
      "Makeup and cosmetics",
      "Hair care products",
      "Nail polish and accessories",
      "Beauty subscription boxes",
      "Salon treatment products",
    ],
  },

  // Jewelry & Accessories
  "Jewelry and Watches": {
    description: "Fine jewelry and timepieces",
    examples: [
      "Engagement and wedding rings",
      "Luxury watches",
      "Designer jewelry pieces",
      "Custom jewelry orders",
      "Watch repair services",
    ],
  },

  // Home Improvement
  "Home Improvement and Hardware": {
    description: "Home repair and construction materials",
    examples: [
      "Power tools and equipment",
      "Building materials and lumber",
      "Paint and supplies",
      "Plumbing fixtures",
      "Electrical components",
      "Garden and landscaping tools",
    ],
  },

  // Pet Services
  "Pet Services and Supplies": {
    description: "Pet care products and services",
    examples: [
      "Pet food and treats",
      "Veterinary services",
      "Pet grooming appointments",
      "Pet insurance",
      "Pet toys and accessories",
      "Pet boarding services",
    ],
  },

  // Insurance
  "Insurance Services": {
    description: "Insurance policies and premiums",
    examples: [
      "Life insurance premiums",
      "Health insurance payments",
      "Auto insurance policies",
      "Home insurance coverage",
      "Travel insurance",
      "Pet insurance plans",
    ],
  },

  // Real Estate
  "Real Estate Services": {
    description: "Property sales and rental services",
    examples: [
      "Real estate agent commissions",
      "Property management fees",
      "Rental deposits",
      "Home inspection services",
      "Title and escrow services",
    ],
  },

  // Charity & Donations
  "Charitable Organizations": {
    description: "Non-profit donations and fundraising",
    examples: [
      "One-time charitable donations",
      "Monthly giving programs",
      "Fundraising campaign contributions",
      "Disaster relief donations",
      "Educational institution donations",
    ],
  },

  // Medical Services
  "Medical and Healthcare Services": {
    description: "Healthcare providers and medical supplies",
    examples: [
      "Doctor visit copays",
      "Dental procedures",
      "Vision care services",
      "Medical equipment rental",
      "Prescription medications",
      "Telemedicine consultations",
    ],
  },

  // Legal Services
  "Legal Services": {
    description: "Legal consultation and representation",
    examples: [
      "Attorney consultation fees",
      "Legal document preparation",
      "Court filing fees",
      "Mediation services",
      "Contract review services",
    ],
  },

  // Event Services
  "Event Planning and Services": {
    description: "Event coordination and services",
    examples: [
      "Wedding planning services",
      "Event venue rentals",
      "Catering services",
      "DJ and entertainment booking",
      "Photography and videography",
      "Party supply rentals",
    ],
  },

  // Photography
  "Photography Services": {
    description: "Professional photography services",
    examples: [
      "Wedding photography packages",
      "Portrait sessions",
      "Commercial photography",
      "Photo editing services",
      "Stock photo licenses",
    ],
  },

  // Printing & Publishing
  "Printing and Publishing": {
    description: "Print services and publications",
    examples: [
      "Business card printing",
      "Book publishing services",
      "Custom t-shirt printing",
      "Marketing materials",
      "Photo printing services",
      "Large format printing",
    ],
  },

  // Storage & Moving
  "Storage and Moving Services": {
    description: "Storage facilities and moving companies",
    examples: [
      "Self-storage unit rentals",
      "Moving company services",
      "Packing supplies",
      "Climate-controlled storage",
      "Vehicle storage",
    ],
  },

  // Security Services
  "Security and Protection": {
    description: "Security systems and services",
    examples: [
      "Home security systems",
      "Security camera installations",
      "Alarm monitoring services",
      "Cybersecurity software",
      "Identity theft protection",
    ],
  },

  // Furniture & Decor
  "Furniture and Home Decor": {
    description: "Home furnishings and decorative items",
    examples: [
      "Living room furniture",
      "Bedroom sets",
      "Office furniture",
      "Home decor accessories",
      "Custom furniture orders",
      "Interior design consultations",
    ],
  },

  // Office Supplies
  "Office Supplies and Equipment": {
    description: "Business office products",
    examples: [
      "Printer and copier supplies",
      "Office furniture",
      "Stationery and paper products",
      "Writing instruments",
      "Office organization products",
    ],
  },

  // Books & Media
  "Books and Media": {
    description: "Physical and digital books",
    examples: [
      "Hardcover and paperback books",
      "E-books and audiobooks",
      "Textbooks and reference books",
      "Magazine subscriptions",
      "Comic books and graphic novels",
    ],
  },

  // Music & Instruments
  "Musical Instruments and Equipment": {
    description: "Instruments and music production gear",
    examples: [
      "Guitars and string instruments",
      "Keyboards and pianos",
      "Drums and percussion",
      "Audio recording equipment",
      "Music lessons",
      "Instrument accessories",
    ],
  },

  // Art & Crafts
  "Arts and Crafts Supplies": {
    description: "Art materials and crafting supplies",
    examples: [
      "Painting supplies and canvases",
      "Craft materials and tools",
      "Sewing and knitting supplies",
      "Scrapbooking materials",
      "DIY project kits",
    ],
  },

  // Collectibles
  "Collectibles and Antiques": {
    description: "Rare and collectible items",
    examples: [
      "Vintage collectibles",
      "Trading cards",
      "Rare coins and stamps",
      "Antique furniture",
      "Limited edition memorabilia",
    ],
  },

  // Baby & Children
  "Baby and Children Products": {
    description: "Products for infants and children",
    examples: [
      "Baby formula and food",
      "Diapers and wipes",
      "Children's clothing",
      "Baby strollers and car seats",
      "Educational toys",
      "Nursery furniture",
    ],
  },

  // Party Supplies
  "Party Supplies and Decorations": {
    description: "Party planning products",
    examples: [
      "Birthday party decorations",
      "Balloons and banners",
      "Disposable tableware",
      "Party favors",
      "Costume rentals",
    ],
  },

  // Outdoor Recreation
  "Outdoor and Recreation": {
    description: "Outdoor activities and equipment",
    examples: [
      "Camping gear and tents",
      "Hiking equipment",
      "Fishing tackle and gear",
      "Bicycles and accessories",
      "Outdoor clothing",
      "Recreation park passes",
    ],
  },

  // Marine & Boating
  "Marine and Boating": {
    description: "Watercraft and marine equipment",
    examples: [
      "Boat rentals",
      "Marine equipment and parts",
      "Fishing boat charters",
      "Marina docking fees",
      "Water sports equipment",
    ],
  },

  // Aviation
  "Aviation Services": {
    description: "Air travel and aviation services",
    examples: [
      "Private jet charters",
      "Flight training courses",
      "Aircraft maintenance",
      "Hangar rentals",
      "Aviation fuel",
    ],
  },

  // Membership Clubs
  "Membership Clubs and Organizations": {
    description: "Club memberships and dues",
    examples: [
      "Golf club memberships",
      "Country club dues",
      "Professional association fees",
      "Social club memberships",
      "Warehouse club memberships",
    ],
  },

  // Agricultural
  "Agricultural Products and Services": {
    description: "Farming and agricultural supplies",
    examples: [
      "Seeds and plants",
      "Fertilizers and pesticides",
      "Farm equipment",
      "Livestock feed",
      "Agricultural consulting",
    ],
  },

  // Energy & Utilities
  "Energy and Fuel": {
    description: "Energy products and fuel services",
    examples: [
      "Gasoline and diesel fuel",
      "Propane and heating oil",
      "Solar panel installations",
      "Electric vehicle charging",
      "Generator rentals",
    ],
  },

  // Waste Management
  "Waste Management and Recycling": {
    description: "Waste disposal and recycling services",
    examples: [
      "Residential trash collection",
      "Recycling services",
      "Dumpster rentals",
      "Hazardous waste disposal",
      "Junk removal services",
    ],
  },

  // Additional High-Risk Categories
  "Nutraceuticals": {
    description: "Nutritional supplements and wellness products",
    examples: [
      "Weight loss supplements",
      "Vitamin and mineral supplements",
      "Herbal wellness products",
      "Protein and fitness supplements",
      "Anti-aging supplements",
    ],
  },

  "Payday Loans and Cash Advances": {
    description: "Short-term lending services",
    examples: [
      "Payday loan applications",
      "Cash advance services",
      "Short-term installment loans",
      "Emergency cash loans",
      "Title loan services",
    ],
  },

  "Credit Repair and Debt Relief": {
    description: "Credit improvement and debt management",
    examples: [
      "Credit score repair services",
      "Debt consolidation programs",
      "Debt settlement services",
      "Credit counseling sessions",
      "Bankruptcy filing assistance",
    ],
  },

  "Binary Options and Forex": {
    description: "Foreign exchange and binary trading",
    examples: [
      "Forex trading platform access",
      "Binary options contracts",
      "Currency trading signals",
      "Forex education courses",
      "Trading bot subscriptions",
    ],
  },

  "Multi-Level Marketing": {
    description: "Network marketing products and memberships",
    examples: [
      "MLM starter kits",
      "Monthly autoship subscriptions",
      "Business opportunity packages",
      "Distributor membership fees",
      "Marketing material packages",
    ],
  },

  "Timeshares and Vacation Clubs": {
    description: "Shared vacation property ownership",
    examples: [
      "Timeshare property shares",
      "Vacation club memberships",
      "Resort week packages",
      "Points-based vacation systems",
      "Timeshare resale services",
    ],
  },

  "Adult Entertainment Venues": {
    description: "Adult entertainment establishments",
    examples: [
      "Gentlemen's club cover charges",
      "Adult entertainment venue tabs",
      "VIP room reservations",
      "Private entertainment bookings",
      "Adult venue memberships",
    ],
  },

  "Psychic and Astrology Services": {
    description: "Spiritual readings and fortune telling",
    examples: [
      "Psychic reading sessions",
      "Tarot card readings",
      "Astrology chart analysis",
      "Palm reading services",
      "Spiritual counseling",
    ],
  },

  "Extended Warranties": {
    description: "Third-party warranty and protection plans",
    examples: [
      "Electronics extended warranties",
      "Vehicle service contracts",
      "Home appliance protection plans",
      "Furniture protection packages",
      "Gadget insurance plans",
    ],
  },

  "Penny Auctions": {
    description: "Bid-fee auction platforms",
    examples: [
      "Auction bid packages",
      "Penny auction credits",
      "Bidding fee purchases",
      "Auto-bidder subscriptions",
      "Premium auction memberships",
    ],
  },

  "Drop Shipping and Wholesale": {
    description: "Wholesale product distribution",
    examples: [
      "Drop shipping supplier fees",
      "Wholesale product orders",
      "Bulk inventory purchases",
      "White-label product sourcing",
      "Distributor registration fees",
    ],
  },

  "Prepaid Cards and Gift Cards": {
    description: "Prepaid payment instruments",
    examples: [
      "Reloadable prepaid cards",
      "Gift card purchases",
      "Virtual prepaid cards",
      "Store-specific gift cards",
      "Multi-use prepaid debit cards",
    ],
  },

  "Bail Bonds": {
    description: "Bail and bond services",
    examples: [
      "Criminal bail bonds",
      "Immigration bail bonds",
      "Appeal bail bonds",
      "Federal bail bonds",
      "Bail bond premium payments",
    ],
  },

  "Pawn Shops": {
    description: "Collateral-based lending",
    examples: [
      "Jewelry pawn loans",
      "Electronics pawn services",
      "Pawn loan renewals",
      "Collateral redemption",
      "Pawn shop purchases",
    ],
  },

  "Check Cashing Services": {
    description: "Financial check processing",
    examples: [
      "Payroll check cashing",
      "Personal check cashing",
      "Money order services",
      "Check verification services",
      "Cash advance on checks",
    ],
  },

  "Virtual Currency Exchanges": {
    description: "Digital asset trading platforms",
    examples: [
      "Cryptocurrency purchases",
      "Crypto-to-fiat exchanges",
      "Virtual token sales",
      "Blockchain asset trading",
      "Crypto wallet services",
    ],
  },

  "Sports Memorabilia": {
    description: "Sports collectibles and signed items",
    examples: [
      "Autographed jerseys",
      "Game-used equipment",
      "Limited edition sports cards",
      "Championship memorabilia",
      "Sports autograph sessions",
    ],
  },

  "Precious Metals and Bullion": {
    description: "Investment-grade metals",
    examples: [
      "Gold bullion bars",
      "Silver coins",
      "Platinum investments",
      "Rare numismatic coins",
      "Precious metal storage",
    ],
  },

  "Massage and Spa Services": {
    description: "Relaxation and wellness treatments",
    examples: [
      "Therapeutic massage sessions",
      "Spa day packages",
      "Hot stone treatments",
      "Facial and skin treatments",
      "Couples massage packages",
    ],
  },

  "Tattoo and Piercing": {
    description: "Body art and modification services",
    examples: [
      "Custom tattoo artwork",
      "Body piercing services",
      "Tattoo removal sessions",
      "Permanent makeup",
      "Tattoo touch-ups",
    ],
  },

  "Tanning Salons": {
    description: "UV and spray tanning services",
    examples: [
      "UV tanning sessions",
      "Spray tan applications",
      "Tanning bed memberships",
      "Tanning product sales",
      "Red light therapy",
    ],
  },

  "Adult Novelties": {
    description: "Adult products and accessories",
    examples: [
      "Adult toys and devices",
      "Intimate apparel",
      "Personal care products",
      "Adult novelty items",
      "Sensual enhancement products",
    ],
  },

  "Money Remittance": {
    description: "International money transfer services",
    examples: [
      "Cross-border wire transfers",
      "International remittances",
      "Mobile money transfers",
      "Agent-assisted transfers",
      "Cash pickup services",
    ],
  },

  "Debt Collection": {
    description: "Collection agency services",
    examples: [
      "Past-due account payments",
      "Collection agency fees",
      "Debt settlement payments",
      "Payment plan enrollments",
      "Collection service charges",
    ],
  },

  "Background Check Services": {
    description: "Personal and employment screening",
    examples: [
      "Employment background checks",
      "Criminal record searches",
      "Tenant screening reports",
      "Identity verification services",
      "Social media background checks",
    ],
  },

  "Traffic School and Driving Courses": {
    description: "Driver education and traffic violation courses",
    examples: [
      "Online traffic school courses",
      "Defensive driving classes",
      "DUI education programs",
      "Teen driver education",
      "Point reduction courses",
    ],
  },

  "Locksmith Services": {
    description: "Lock installation and emergency access",
    examples: [
      "Emergency lockout services",
      "Lock rekeying",
      "Safe installation",
      "Key duplication",
      "Smart lock installation",
    ],
  },

  "Consulting Services": {
    description: "Professional business consulting",
    examples: [
      "Management consulting",
      "IT consulting services",
      "Financial advisory",
      "HR consulting",
      "Strategy consulting sessions",
    ],
  },

  "Freelance Services": {
    description: "Independent contractor work",
    examples: [
      "Graphic design projects",
      "Content writing services",
      "Web development",
      "Virtual assistant services",
      "Social media management",
    ],
  },

  "Translation Services": {
    description: "Language translation and interpretation",
    examples: [
      "Document translation",
      "Live interpretation services",
      "Website localization",
      "Certified translations",
      "Subtitling services",
    ],
  },

  // Exact API category names
  "Vehicle Sales and Financing": {
    description: "Automotive sales and financing services",
    examples: [
      "New and used car sales",
      "Auto loan financing",
      "Lease agreements",
      "Vehicle trade-ins",
      "Extended auto warranties",
      "Vehicle registration services",
    ],
  },

  "Direct Marketing – Outbound Telemarketing": {
    description: "Outbound sales and marketing calls",
    examples: [
      "Telemarketing campaign services",
      "Lead generation calls",
      "Product sales via phone",
      "Subscription enrollments",
      "Survey and polling services",
      "Appointment setting services",
    ],
  },

  "Cosmetic Stores": {
    description: "Beauty and cosmetic retail products",
    examples: [
      "Makeup and foundation",
      "Skincare products and serums",
      "Perfumes and fragrances",
      "Cosmetic brushes and tools",
      "Beauty gift sets",
      "Professional makeup lines",
    ],
  },

  "Drugs, Proprietaries & Sundries": {
    description: "Over-the-counter medications and health products",
    examples: [
      "Over-the-counter pain relievers",
      "Cold and flu medications",
      "Vitamins and supplements",
      "First aid supplies",
      "Personal care items",
      "Health monitoring devices",
    ],
  },

  "Jewelry and Luxury Goods": {
    description: "Fine jewelry and luxury retail items",
    examples: [
      "Diamond engagement rings",
      "Gold and silver jewelry",
      "Luxury watches (Rolex, Cartier)",
      "Designer handbags",
      "High-end accessories",
      "Custom jewelry designs",
    ],
  },

  "Alcoholic Beverages (Off-Premises)": {
    description: "Packaged alcohol for off-site consumption",
    examples: [
      "Wine bottles and cases",
      "Craft beer and imports",
      "Spirits and liquor",
      "Champagne and sparkling wine",
      "Alcohol gift sets",
      "Rare and vintage bottles",
    ],
  },

  "Telecom Services": {
    description: "Telecommunications and connectivity services",
    examples: [
      "Mobile phone plans",
      "Internet service subscriptions",
      "Home phone services",
      "Business phone systems",
      "Data plan upgrades",
      "International calling packages",
    ],
  },

  "Direct Marketing – Travel": {
    description: "Travel packages via direct marketing",
    examples: [
      "Vacation package sales",
      "Timeshare presentations",
      "Travel club memberships",
      "Cruise line promotions",
      "Resort booking offers",
      "Travel rewards programs",
    ],
  },

  "Drug Stores and Pharmacies": {
    description: "Pharmacy services and prescriptions",
    examples: [
      "Prescription medications",
      "Pharmacy refills",
      "Immunization services",
      "Health screenings",
      "Medical supplies",
      "Compounded medications",
    ],
  },

  "Jewelry, Watch, and Precious Metal Stores": {
    description: "Jewelry and timepiece retail",
    examples: [
      "Diamond and gemstone jewelry",
      "Swiss luxury watches",
      "Wedding and engagement rings",
      "Gold and silver chains",
      "Watch repair and servicing",
      "Custom jewelry creation",
    ],
  },

  "Tobacco Stores and Stands": {
    description: "Tobacco products and accessories",
    examples: [
      "Cigarettes and cigars",
      "Pipe tobacco",
      "Vaping products and e-liquids",
      "Rolling papers and accessories",
      "Hookah tobacco and supplies",
      "Tobacco gift sets",
    ],
  },

  "Direct Marketing – Adult Products": {
    description: "Adult product sales via direct marketing",
    examples: [
      "Adult novelty items",
      "Intimate wellness products",
      "Adult entertainment subscriptions",
      "Sensual enhancement products",
      "Adult toy catalogs",
      "Intimate apparel sales",
    ],
  },

  "Betting, Gambling, and Casino Services": {
    description: "Wagering and gaming services",
    examples: [
      "Sports betting wagers",
      "Online casino games",
      "Poker tournament entries",
      "Slot machine credits",
      "Daily fantasy sports",
      "Horse racing bets",
    ],
  },

  "Telecom Sales and Equipment": {
    description: "Telecommunications equipment and devices",
    examples: [
      "Mobile phones and smartphones",
      "Wireless routers",
      "Phone accessories",
      "Business phone systems",
      "Networking equipment",
      "SIM cards and activation",
    ],
  },

  "Furniture Stores": {
    description: "Home and office furniture retail",
    examples: [
      "Living room furniture sets",
      "Bedroom furniture",
      "Office desks and chairs",
      "Outdoor patio furniture",
      "Kitchen and dining tables",
      "Custom upholstery",
    ],
  },

  "Marketplaces (General Merchandise)": {
    description: "Multi-category retail platforms",
    examples: [
      "Online marketplace purchases",
      "Third-party seller products",
      "Multi-vendor transactions",
      "Peer-to-peer marketplace sales",
      "General merchandise orders",
      "Auction platform purchases",
    ],
  },

  "Direct Marketing – Catalog Merchants": {
    description: "Catalog-based product sales",
    examples: [
      "Mail-order catalog purchases",
      "Catalog subscription services",
      "Home goods catalog orders",
      "Fashion catalog sales",
      "Specialty catalog items",
      "Seasonal catalog promotions",
    ],
  },

  "Security Brokers and Dealers": {
    description: "Securities trading and brokerage",
    examples: [
      "Stock brokerage fees",
      "Bond trading commissions",
      "Securities transaction fees",
      "Brokerage account services",
      "Investment advisory fees",
      "Trading platform subscriptions",
    ],
  },

  "Ferry Ticketing / Travel Services": {
    description: "Ferry transportation and travel bookings",
    examples: [
      "Ferry passenger tickets",
      "Vehicle ferry reservations",
      "Island hopping passes",
      "Commuter ferry passes",
      "Cruise ferry bookings",
      "Water taxi services",
    ],
  },
};
