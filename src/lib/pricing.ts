import { addDays, eachDayOfInterval, isWithinInterval } from "date-fns";
import type { Pricing, SeasonalRate } from "@/types";

export interface PricedNight {
  date: Date;
  rate: number;
  isSeasonal: boolean;
  seasonName?: string;
}

export interface PricingBreakdown {
  nights: PricedNight[];
  subtotal: number;
  cleaningFee: number;
  taxes: number;
  total: number;
}

function getRateForDate(date: Date, baseRate: number, seasonalRates: SeasonalRate[]): PricedNight {
  const match = seasonalRates.find((season) =>
    isWithinInterval(date, {
      start: season.startDate.toDate(),
      end: season.endDate.toDate(),
    })
  );

  if (!match) {
    return {
      date,
      rate: baseRate,
      isSeasonal: false,
    };
  }

  return {
    date,
    rate: match.rate,
    isSeasonal: true,
    seasonName: match.name,
  };
}

export function calculatePricingForStay(
  pricing: Pricing,
  checkIn: Date,
  checkOut: Date
): PricingBreakdown {
  if (checkOut <= checkIn) {
    throw new Error("checkOut must be after checkIn");
  }

  const nights = eachDayOfInterval({
    start: checkIn,
    end: addDays(checkOut, -1),
  }).map((date) => getRateForDate(date, pricing.baseRate, pricing.seasonalRates ?? []));

  const subtotal = nights.reduce((sum, night) => sum + night.rate, 0);
  const cleaningFee = pricing.cleaningFee;
  const taxes = Math.round((subtotal + cleaningFee) * pricing.taxRate) / 100;
  const total = subtotal + cleaningFee + taxes;

  return {
    nights,
    subtotal,
    cleaningFee,
    taxes,
    total,
  };
}

