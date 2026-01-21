import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  Globe, 
  ShoppingBag, 
  Smartphone,
  Car,
  Plane,
  Package,
  Palette,
  Pill,
  Gem,
  Shield,
  Store,
  Wine,
  Cigarette,
  Leaf,
  Heart,
  Gamepad2,
  Ship,
  Phone,
  ChevronRight,
  Star,
  Info,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProviderRegion } from '../types/paymentProviders';

// Full JSON data
const providerCategoriesData = {
  "data": [
    {"categories":[{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"}],"id":"provider_001","payment_provider":"stripe"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"}],"id":"provider_002","payment_provider":"adyen"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"}],"id":"provider_003","payment_provider":"checkoutcom"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"}],"id":"provider_004","payment_provider":"worldpay"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"}],"id":"provider_005","payment_provider":"fis"},
    {"categories":[{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"}],"id":"provider_006","payment_provider":"fiserv"},
    {"categories":[{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"}],"id":"provider_007","payment_provider":"globalpayments"},
    {"categories":[{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"}],"id":"provider_008","payment_provider":"nuvei"},
    {"categories":[{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"}],"id":"provider_009","payment_provider":"rapyd"},
    {"categories":[{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"}],"id":"provider_010","payment_provider":"paypal"},
    {"categories":[{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"}],"id":"provider_011","payment_provider":"square"},
    {"categories":[{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"}],"id":"provider_012","payment_provider":"braintree"},
    {"categories":[{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"}],"id":"provider_013","payment_provider":"authorizenet"},
    {"categories":[{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"}],"id":"provider_014","payment_provider":"chasepaymentech"},
    {"categories":[{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"}],"id":"provider_015","payment_provider":"elavon"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"}],"id":"provider_016","payment_provider":"bluesnap"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"}],"id":"provider_017","payment_provider":"mollie"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"}],"id":"provider_018","payment_provider":"worldline"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"}],"id":"provider_019","payment_provider":"nexi"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"}],"id":"provider_020","payment_provider":"klarna"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"}],"id":"provider_021","payment_provider":"trustly"},
    {"categories":[{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"}],"id":"provider_022","payment_provider":"vivawallet"},
    {"categories":[{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"}],"id":"provider_023","payment_provider":"payu"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"}],"id":"provider_024","payment_provider":"truelayer"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"}],"id":"provider_025","payment_provider":"gocardless"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"}],"id":"provider_026","payment_provider":"tranzila"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"}],"id":"provider_027","payment_provider":"payplus"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"}],"id":"provider_028","payment_provider":"zcredit"},
    {"categories":[{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"}],"id":"provider_029","payment_provider":"hyp"},
    {"categories":[{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"}],"id":"provider_030","payment_provider":"isracard"},
    {"categories":[{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"}],"id":"provider_031","payment_provider":"mercadopago"},
    {"categories":[{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"}],"id":"provider_032","payment_provider":"ebanx"},
    {"categories":[{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"}],"id":"provider_033","payment_provider":"dlocal"},
    {"categories":[{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"}],"id":"provider_034","payment_provider":"pagseguro"},
    {"categories":[{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"}],"id":"provider_035","payment_provider":"cielo"},
    {"categories":[{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"},{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"}],"id":"provider_036","payment_provider":"paytm"},
    {"categories":[{"id":"68a18ad49d3b5972248ca508","region":"Global","title":"Pawn Shops"},{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"}],"id":"provider_037","payment_provider":"razorpay"},
    {"categories":[{"id":"68a18ad49d3b5972248ca509","region":"Global","title":"Direct Marketing – Outbound Telemarketing"},{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"}],"id":"provider_038","payment_provider":"xendit"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50a","region":"Global","title":"Alcoholic Beverages (Off-Premises)"},{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"}],"id":"provider_039","payment_provider":"2c2p"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50b","region":"Global","title":"Cigar Stores and Stands"},{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"}],"id":"provider_040","payment_provider":"airwallex"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50c","region":"Global","title":"Tobacco Stores and Stands"},{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"}],"id":"provider_041","payment_provider":"alipay"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50d","region":"Global","title":"CBD and Marijuana Products"},{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"}],"id":"provider_042","payment_provider":"wechatpay"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50e","region":"Global","title":"Direct Marketing – Adult Products"},{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"}],"id":"provider_043","payment_provider":"paystack"},
    {"categories":[{"id":"68a18ad49d3b5972248ca50f","region":"Global","title":"Dating and Escort Services"},{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"}],"id":"provider_044","payment_provider":"flutterwave"},
    {"categories":[{"id":"68a18ad49d3b5972248ca510","region":"Global","title":"Betting, Gambling, and Casino Services"},{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"}],"id":"provider_045","payment_provider":"mpesa"},
    {"categories":[{"id":"68c270e19c2c91d8933dddea","region":"Global","title":"Ferry Ticketing / Travel Services"},{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"}],"id":"provider_046","payment_provider":"networkinternational"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fb","region":"Global","title":"Telecom Services"},{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"}],"id":"provider_047","payment_provider":"paymob"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fc","region":"Global","title":"Telecom Sales and Equipment"},{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"}],"id":"provider_048","payment_provider":"hyperpay"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fd","region":"Global","title":"Furniture Stores"},{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"}],"id":"provider_049","payment_provider":"stripe_us"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4fe","region":"Global","title":"Vehicle Sales and Financing"},{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"}],"id":"provider_050","payment_provider":"stripe_uk"},
    {"categories":[{"id":"68a18ad49d3b5972248ca4ff","region":"Global","title":"Direct Marketing – Travel"},{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"}],"id":"provider_051","payment_provider":"adyen_eu"},
    {"categories":[{"id":"68a18ad49d3b5972248ca500","region":"Global","title":"Marketplaces (General Merchandise)"},{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"}],"id":"provider_052","payment_provider":"checkoutcom_uk"},
    {"categories":[{"id":"68a18ad49d3b5972248ca501","region":"Global","title":"Direct Marketing – Catalog Merchants"},{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"}],"id":"provider_053","payment_provider":"worldpay_uk"},
    {"categories":[{"id":"68a18ad49d3b5972248ca502","region":"Global","title":"Cosmetic Stores"},{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"}],"id":"provider_054","payment_provider":"payu_latam"},
    {"categories":[{"id":"68a18ad49d3b5972248ca503","region":"Global","title":"Drug Stores and Pharmacies"},{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"}],"id":"provider_055","payment_provider":"payu_uk"},
    {"categories":[{"id":"68a18ad49d3b5972248ca504","region":"Global","title":"Drugs, Proprietaries & Sundries"},{"id":"68a18ad49d3b5972248ca505","region":"Global","title":"Jewelry, Watch, and Precious Metal Stores"},{"id":"68a18ad49d3b5972248ca506","region":"Global","title":"Jewelry and Luxury Goods"},{"id":"68a18ad49d3b5972248ca507","region":"Global","title":"Security Brokers and Dealers"}],"id":"provider_056","payment_provider":"paypal_us"}
  ]
};

// Category icon mapping
const getCategoryIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('telecom') || lower.includes('phone')) return Phone;
  if (lower.includes('furniture')) return Store;
  if (lower.includes('vehicle') || lower.includes('car')) return Car;
  if (lower.includes('travel') || lower.includes('ferry')) return Plane;
  if (lower.includes('marketplace') || lower.includes('catalog')) return ShoppingBag;
  if (lower.includes('cosmetic') || lower.includes('beauty')) return Palette;
  if (lower.includes('drug') || lower.includes('pharmacy') || lower.includes('pill')) return Pill;
  if (lower.includes('jewelry') || lower.includes('luxury') || lower.includes('gem')) return Gem;
  if (lower.includes('security') || lower.includes('broker')) return Shield;
  if (lower.includes('pawn')) return Store;
  if (lower.includes('alcohol') || lower.includes('beverage') || lower.includes('wine')) return Wine;
  if (lower.includes('cigar') || lower.includes('tobacco')) return Cigarette;
  if (lower.includes('cbd') || lower.includes('marijuana')) return Leaf;
  if (lower.includes('dating') || lower.includes('escort') || lower.includes('adult')) return Heart;
  if (lower.includes('gambling') || lower.includes('casino') || lower.includes('betting')) return Gamepad2;
  if (lower.includes('ferry')) return Ship;
  return Package;
};

// Risk level based on category
const getRiskLevel = (title: string): 'low' | 'medium' | 'high' => {
  const lower = title.toLowerCase();
  if (lower.includes('gambling') || lower.includes('casino') || lower.includes('betting') || 
      lower.includes('adult') || lower.includes('cbd') || lower.includes('marijuana') ||
      lower.includes('dating') || lower.includes('escort')) return 'high';
  if (lower.includes('alcohol') || lower.includes('tobacco') || lower.includes('cigar') ||
      lower.includes('pawn') || lower.includes('telemarketing')) return 'medium';
  return 'low';
};

const getRiskColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high': return 'from-red-500/20 to-orange-500/20 border-red-500/30';
    case 'medium': return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
    case 'low': return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30';
  }
};

const getRiskBadgeColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
};

// Provider region mapping (simplified for demo)
const getProviderRegion = (providerKey: string): ProviderRegion => {
  if (providerKey.includes('_us')) return 'North America';
  if (providerKey.includes('_uk') || providerKey.includes('_eu')) return 'Europe';
  if (providerKey.includes('isracard') || providerKey.includes('tranzila') || 
      providerKey.includes('payplus') || providerKey.includes('zcredit') || 
      providerKey.includes('hyp')) return 'Israel';
  if (providerKey.includes('_latam') || providerKey.includes('mercadopago') || 
      providerKey.includes('ebanx') || providerKey.includes('dlocal') ||
      providerKey.includes('pagseguro') || providerKey.includes('cielo')) return 'LATAM';
  if (providerKey.includes('paytm') || providerKey.includes('razorpay') ||
      providerKey.includes('xendit') || providerKey.includes('2c2p') ||
      providerKey.includes('alipay') || providerKey.includes('wechatpay')) return 'APAC';
  if (providerKey.includes('paystack') || providerKey.includes('flutterwave') ||
      providerKey.includes('mpesa') || providerKey.includes('paymob') ||
      providerKey.includes('hyperpay') || providerKey.includes('networkinternational')) return 'Africa & Middle East';
  return 'Global';
};

const ALL_REGIONS: ProviderRegion[] = [
  'Global',
  'North America',
  'Europe',
  'United Kingdom',
  'Israel',
  'LATAM',
  'APAC',
  'Africa & Middle East',
];

const ProviderCategoriesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<ProviderRegion | null>(null);

  const providers = providerCategoriesData.data;

  // Group providers by region
  const groupedProviders = useMemo(() => {
    const groups: Record<ProviderRegion, typeof providers> = {
      'Global': [],
      'North America': [],
      'Europe': [],
      'United Kingdom': [],
      'Israel': [],
      'LATAM': [],
      'APAC': [],
      'Africa & Middle East': [],
    };

    providers.forEach(provider => {
      const region = getProviderRegion(provider.payment_provider);
      groups[region].push(provider);
    });

    // Sort each group alphabetically
    Object.keys(groups).forEach(region => {
      groups[region as ProviderRegion].sort((a, b) => 
        a.payment_provider.localeCompare(b.payment_provider)
      );
    });

    return groups;
  }, []);

  // Filter providers by search and region
  const filteredGroupedProviders = useMemo(() => {
    const filtered: Record<ProviderRegion, typeof providers> = {
      'Global': [],
      'North America': [],
      'Europe': [],
      'United Kingdom': [],
      'Israel': [],
      'LATAM': [],
      'APAC': [],
      'Africa & Middle East': [],
    };

    Object.entries(groupedProviders).forEach(([region, regionProviders]) => {
      if (selectedRegionFilter && region !== selectedRegionFilter) return;

      filtered[region as ProviderRegion] = regionProviders.filter(provider =>
        provider.payment_provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.categories.some(cat => cat.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    return filtered;
  }, [groupedProviders, searchTerm, selectedRegionFilter]);

  // Get selected provider details
  const selectedProviderData = useMemo(() => {
    if (!selectedProvider) return null;
    return providers.find(p => p.id === selectedProvider);
  }, [selectedProvider]);

  // Auto-select first provider on mount
  React.useEffect(() => {
    if (!selectedProvider && providers.length > 0) {
      setSelectedProvider(providers[0].id);
    }
  }, []);

  const totalProviders = Object.values(filteredGroupedProviders).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Provider List */}
      <div className="w-80 border-r border-borderSubtle bg-surface flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-borderSubtle bg-surfaceElevated">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search providers or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-borderSubtle rounded-lg text-sm text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
          
          {/* Region Filter Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedRegionFilter(null)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                !selectedRegionFilter
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface text-textSecondary border-borderSubtle hover:bg-surfaceElevated'
              }`}
            >
              All
            </button>
            {ALL_REGIONS.filter(r => groupedProviders[r].length > 0).map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegionFilter(region === selectedRegionFilter ? null : region)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  selectedRegionFilter === region
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'bg-surface text-textSecondary border-borderSubtle hover:bg-surfaceElevated'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-3 text-xs text-textMuted">
            {totalProviders} {totalProviders === 1 ? 'provider' : 'providers'}
          </div>
        </div>

        {/* Provider List */}
        <div className="flex-1 overflow-y-auto">
          {ALL_REGIONS.map(region => {
            const regionProviders = filteredGroupedProviders[region];
            if (regionProviders.length === 0) return null;

            return (
              <div key={region} className="mb-1">
                {/* Region Header */}
                <div className="px-4 py-2 bg-surfaceElevated/50 border-b border-borderSubtle sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-textMuted" />
                    <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                      {region}
                    </h3>
                    <span className="text-xs text-textMuted">({regionProviders.length})</span>
                  </div>
                </div>

                {/* Providers */}
                {regionProviders.map(provider => {
                  const isSelected = selectedProvider === provider.id;
                  return (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'bg-accent/10 border-l-2 border-accent'
                          : 'hover:bg-surfaceElevated border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium capitalize truncate ${
                          isSelected ? 'text-accent' : 'text-textPrimary'
                        }`}>
                          {provider.payment_provider.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-textMuted mt-0.5">
                          {provider.categories.length} {provider.categories.length === 1 ? 'category' : 'categories'}
                        </div>
                      </div>
                      {isSelected && <ChevronRight className="w-4 h-4 text-accent flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Content - Category Details */}
      <div className="flex-1 overflow-y-auto bg-background">
        <AnimatePresence mode="wait">
          {selectedProviderData ? (
            <motion.div
              key={selectedProviderData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-textPrimary capitalize">
                      {selectedProviderData.payment_provider.replace(/_/g, ' ')}
                    </h1>
                    <p className="text-textSecondary mt-1">
                      Payment Service Provider
                    </p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-textSecondary uppercase">Total Categories</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">
                      {selectedProviderData.categories.length}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-textSecondary uppercase">Coverage</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">
                      {Math.round((selectedProviderData.categories.length / 30) * 100)}%
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-textSecondary uppercase">Region</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {getProviderRegion(selectedProviderData.payment_provider)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-textPrimary">Accepted Categories</h2>
                  <div className="flex items-center gap-2 text-xs text-textSecondary">
                    <Info className="w-4 h-4" />
                    <span>Hover for category details</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {selectedProviderData.categories.map((category, index) => {
                    const Icon = getCategoryIcon(category.title);
                    const riskLevel = getRiskLevel(category.title);
                    
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className={`group relative bg-gradient-to-br ${getRiskColor(riskLevel)} border rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                        title={`Category ID: ${category.id}`}
                      >
                        {/* Risk Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getRiskBadgeColor(riskLevel)}`}>
                            {riskLevel.toUpperCase()}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                          riskLevel === 'high' ? 'bg-red-500/20' :
                          riskLevel === 'medium' ? 'bg-amber-500/20' :
                          'bg-emerald-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            riskLevel === 'high' ? 'text-red-400' :
                            riskLevel === 'medium' ? 'text-amber-400' :
                            'text-emerald-400'
                          }`} />
                        </div>

                        {/* Content */}
                        <h3 className="text-sm font-semibold text-textPrimary mb-2 leading-tight">
                          {category.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-textMuted">
                          <Globe className="w-3 h-3" />
                          <span>{category.region}</span>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center">
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-textMuted">Category ID:</span>
                              <code className="ml-2 text-accent font-mono text-[10px]">
                                {category.id}
                              </code>
                            </div>
                            <div>
                              <span className="text-textMuted">Region:</span>
                              <span className="ml-2 text-textPrimary font-medium">{category.region}</span>
                            </div>
                            <div>
                              <span className="text-textMuted">Risk Level:</span>
                              <span className={`ml-2 font-semibold ${
                                riskLevel === 'high' ? 'text-red-400' :
                                riskLevel === 'medium' ? 'text-amber-400' :
                                'text-emerald-400'
                              }`}>
                                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Info Panel */}
              <div className="mt-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-textPrimary mb-2">About Risk Levels</h3>
                    <div className="text-sm text-textSecondary space-y-2">
                      <p><span className="font-semibold text-red-400">High Risk:</span> Gambling, adult content, CBD, dating services</p>
                      <p><span className="font-semibold text-amber-400">Medium Risk:</span> Alcohol, tobacco, pawn shops, telemarketing</p>
                      <p><span className="font-semibold text-emerald-400">Low Risk:</span> Retail, services, standard e-commerce</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-textMuted">
              <div className="text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a provider to view categories</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderCategoriesTable;
