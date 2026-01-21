import React, { useState, useMemo } from 'react';

// Full JSON data
const providerCategoriesData = {
  "data": [
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        }
      ],
      "id": "provider_001",
      "payment_provider": "stripe"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        }
      ],
      "id": "provider_002",
      "payment_provider": "adyen"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        }
      ],
      "id": "provider_003",
      "payment_provider": "checkoutcom"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        }
      ],
      "id": "provider_004",
      "payment_provider": "worldpay"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        }
      ],
      "id": "provider_005",
      "payment_provider": "fis"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        }
      ],
      "id": "provider_006",
      "payment_provider": "fiserv"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        }
      ],
      "id": "provider_007",
      "payment_provider": "globalpayments"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        }
      ],
      "id": "provider_008",
      "payment_provider": "nuvei"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        }
      ],
      "id": "provider_009",
      "payment_provider": "rapyd"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        }
      ],
      "id": "provider_010",
      "payment_provider": "paypal"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        }
      ],
      "id": "provider_011",
      "payment_provider": "square"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        }
      ],
      "id": "provider_012",
      "payment_provider": "braintree"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        }
      ],
      "id": "provider_013",
      "payment_provider": "authorizenet"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        }
      ],
      "id": "provider_014",
      "payment_provider": "chasepaymentech"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        }
      ],
      "id": "provider_015",
      "payment_provider": "elavon"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        }
      ],
      "id": "provider_016",
      "payment_provider": "bluesnap"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        }
      ],
      "id": "provider_017",
      "payment_provider": "mollie"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        }
      ],
      "id": "provider_018",
      "payment_provider": "worldline"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        }
      ],
      "id": "provider_019",
      "payment_provider": "nexi"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        }
      ],
      "id": "provider_020",
      "payment_provider": "klarna"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        }
      ],
      "id": "provider_021",
      "payment_provider": "trustly"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        }
      ],
      "id": "provider_022",
      "payment_provider": "vivawallet"
    },
    {
      "categories": [
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        }
      ],
      "id": "provider_023",
      "payment_provider": "payu"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        }
      ],
      "id": "provider_024",
      "payment_provider": "truelayer"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        }
      ],
      "id": "provider_025",
      "payment_provider": "gocardless"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        }
      ],
      "id": "provider_026",
      "payment_provider": "tranzila"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        }
      ],
      "id": "provider_027",
      "payment_provider": "payplus"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        }
      ],
      "id": "provider_028",
      "payment_provider": "zcredit"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        }
      ],
      "id": "provider_029",
      "payment_provider": "hyp"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        }
      ],
      "id": "provider_030",
      "payment_provider": "isracard"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        }
      ],
      "id": "provider_031",
      "payment_provider": "mercadopago"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        }
      ],
      "id": "provider_032",
      "payment_provider": "ebanx"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        }
      ],
      "id": "provider_033",
      "payment_provider": "dlocal"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        }
      ],
      "id": "provider_034",
      "payment_provider": "pagseguro"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        }
      ],
      "id": "provider_035",
      "payment_provider": "cielo"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        },
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        }
      ],
      "id": "provider_036",
      "payment_provider": "paytm"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca508",
          "region": "Global",
          "title": "Pawn Shops"
        },
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        }
      ],
      "id": "provider_037",
      "payment_provider": "razorpay"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca509",
          "region": "Global",
          "title": "Direct Marketing – Outbound Telemarketing"
        },
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        }
      ],
      "id": "provider_038",
      "payment_provider": "xendit"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50a",
          "region": "Global",
          "title": "Alcoholic Beverages (Off-Premises)"
        },
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        }
      ],
      "id": "provider_039",
      "payment_provider": "2c2p"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50b",
          "region": "Global",
          "title": "Cigar Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        }
      ],
      "id": "provider_040",
      "payment_provider": "airwallex"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50c",
          "region": "Global",
          "title": "Tobacco Stores and Stands"
        },
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        }
      ],
      "id": "provider_041",
      "payment_provider": "alipay"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50d",
          "region": "Global",
          "title": "CBD and Marijuana Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        }
      ],
      "id": "provider_042",
      "payment_provider": "wechatpay"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50e",
          "region": "Global",
          "title": "Direct Marketing – Adult Products"
        },
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        }
      ],
      "id": "provider_043",
      "payment_provider": "paystack"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca50f",
          "region": "Global",
          "title": "Dating and Escort Services"
        },
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        }
      ],
      "id": "provider_044",
      "payment_provider": "flutterwave"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca510",
          "region": "Global",
          "title": "Betting, Gambling, and Casino Services"
        },
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        }
      ],
      "id": "provider_045",
      "payment_provider": "mpesa"
    },
    {
      "categories": [
        {
          "id": "68c270e19c2c91d8933dddea",
          "region": "Global",
          "title": "Ferry Ticketing / Travel Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        }
      ],
      "id": "provider_046",
      "payment_provider": "networkinternational"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fb",
          "region": "Global",
          "title": "Telecom Services"
        },
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        }
      ],
      "id": "provider_047",
      "payment_provider": "paymob"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fc",
          "region": "Global",
          "title": "Telecom Sales and Equipment"
        },
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        }
      ],
      "id": "provider_048",
      "payment_provider": "hyperpay"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fd",
          "region": "Global",
          "title": "Furniture Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        }
      ],
      "id": "provider_049",
      "payment_provider": "stripe_us"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4fe",
          "region": "Global",
          "title": "Vehicle Sales and Financing"
        },
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        }
      ],
      "id": "provider_050",
      "payment_provider": "stripe_uk"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca4ff",
          "region": "Global",
          "title": "Direct Marketing – Travel"
        },
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        }
      ],
      "id": "provider_051",
      "payment_provider": "adyen_eu"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca500",
          "region": "Global",
          "title": "Marketplaces (General Merchandise)"
        },
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        }
      ],
      "id": "provider_052",
      "payment_provider": "checkoutcom_uk"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca501",
          "region": "Global",
          "title": "Direct Marketing – Catalog Merchants"
        },
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        }
      ],
      "id": "provider_053",
      "payment_provider": "worldpay_uk"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca502",
          "region": "Global",
          "title": "Cosmetic Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        }
      ],
      "id": "provider_054",
      "payment_provider": "payu_latam"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca503",
          "region": "Global",
          "title": "Drug Stores and Pharmacies"
        },
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        }
      ],
      "id": "provider_055",
      "payment_provider": "payu_uk"
    },
    {
      "categories": [
        {
          "id": "68a18ad49d3b5972248ca504",
          "region": "Global",
          "title": "Drugs, Proprietaries & Sundries"
        },
        {
          "id": "68a18ad49d3b5972248ca505",
          "region": "Global",
          "title": "Jewelry, Watch, and Precious Metal Stores"
        },
        {
          "id": "68a18ad49d3b5972248ca506",
          "region": "Global",
          "title": "Jewelry and Luxury Goods"
        },
        {
          "id": "68a18ad49d3b5972248ca507",
          "region": "Global",
          "title": "Security Brokers and Dealers"
        }
      ],
      "id": "provider_056",
      "payment_provider": "paypal_us"
    }
  ],
  "error": null,
  "status_code": 200,
  "success": true
};

const ProviderCategoriesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'provider' | 'categories'>('provider');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const providers = providerCategoriesData.data;

  // Filter and sort
  const filteredProviders = useMemo(() => {
    let filtered = providers.filter(provider => {
      const providerMatch = provider.payment_provider.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = provider.categories.some(cat => 
        cat.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return providerMatch || categoryMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'provider') {
        const compareResult = a.payment_provider.localeCompare(b.payment_provider);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      } else {
        const compareResult = a.categories.length - b.categories.length;
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder]);

  const handleSort = (column: 'provider' | 'categories') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Payment Provider Categories
          </h1>
          <p className="text-textSecondary">
            {providers.length} providers • {providers.reduce((sum, p) => sum + p.categories.length, 0)} total category assignments
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by provider or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface border border-borderSubtle text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surfaceElevated border-b border-borderSubtle">
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-textPrimary cursor-pointer hover:bg-surface/50 transition-colors"
                    onClick={() => handleSort('provider')}
                  >
                    <div className="flex items-center gap-2">
                      Payment Provider
                      {sortBy === 'provider' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-textPrimary cursor-pointer hover:bg-surface/50 transition-colors"
                    onClick={() => handleSort('categories')}
                  >
                    <div className="flex items-center gap-2">
                      Categories ({sortBy === 'categories' ? (sortOrder === 'asc' ? 'Low-High' : 'High-Low') : 'Click to sort'})
                      {sortBy === 'categories' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">
                    Provider ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                {filteredProviders.map((provider) => (
                  <tr 
                    key={provider.id}
                    className="hover:bg-surfaceElevated/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-textPrimary capitalize">
                        {provider.payment_provider.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {provider.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                            title={`ID: ${category.id} | Region: ${category.region}`}
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-textMuted">
                        {provider.categories.length} {provider.categories.length === 1 ? 'category' : 'categories'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-textSecondary bg-surface px-2 py-1 rounded">
                        {provider.id}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="mt-4 text-sm text-textSecondary">
            Showing {filteredProviders.length} of {providers.length} providers
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCategoriesTable;
