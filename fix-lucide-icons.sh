#!/bin/bash

# Fix Calculator import in DiscountCalculator
sed -i "s/import { DollarSign, TrendingDown, Tag, ShoppingCart, Sparkles, Gift, Zap, Trophy, Star, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';/import { DollarSign, TrendingDown, Tag, ShoppingCart, Sparkles, Gift, Zap, Trophy, Star, ShoppingBag, CreditCard, TrendingUp, Calculator } from 'lucide-react';/" frontend/pages/calculators/utility/DiscountCalculator.tsx

# Fix icon imports in InvestmentCalculator
sed -i "s/import { DollarSign, TrendingUp, AlertCircle, Info, Calculator, PieChart } from 'lucide-react';/import { DollarSign, TrendingUp, AlertCircle, Info, Calculator } from 'lucide-react';\nimport PieChart from 'lucide-react\/dist\/esm\/icons\/pie-chart';/" frontend/pages/calculators/financial/InvestmentCalculator.tsx

echo "Fixed lucide-react icon imports"
