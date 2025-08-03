"use server";

import prisma from "@/lib/prisma";

/**
 * Checks if the Outfit table exists in the database
 * @returns Promise<boolean> - true if the table exists, false otherwise
 */
export async function checkOutfitTableExists(): Promise<boolean> {
  try {
    // Try to query the outfit table
    await prisma.outfit.findFirst();
    return true;
  } catch {
    // If there's an error, the table likely doesn't exist
    return false;
  }
}
